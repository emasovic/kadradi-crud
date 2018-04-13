import db from './db'

async function isWorking(args) {
  const danas = args.danas.getDay() + 1 + '.' + args.danas.getMonth() + 1;
  let specialDate = false
  const dan = args.danas.getDay();
  const vreme = Number(args.danas.getHours().toString() + args.danas.getMinutes().toString());
  let vremeRada;
  if (args.specialDate != null) {

    await Promise.all(args.specialDate.map(async item => {
      if (item.date == danas) {
        specialDate = true;
        if (item.opening == null) {
          vremeRada = null
        } else {
          vremeRada.opening = item.opening
          vremeRada.closing = item.closing
        }

      }
    }))
  }
  if (!vremeRada) {
    if (dan == 1) {
      vremeRada = args.wtMon;
    } else if (dan == 2) {
      vremeRada = args.wtTue;
    } else if (dan == 3) {
      vremeRada = args.wtWed;
    } else if (dan == 4) {
      vremeRada = args.wtThu;
    } else if (dan == 5) {
      vremeRada = args.wtFri;
    } else if (dan == 6) {
      vremeRada = args.wtSat;
    } else if (dan == 7) {
      vremeRada = args.wtSun;
    }
  }
  if (vremeRada == null) {
    return false
  } else {
    vremeRada.otvaranje = parseInt(vremeRada.opening)
    vremeRada.zatvaranje = parseInt(vremeRada.closing)
    if (vremeRada.otvaranje > vremeRada.zatvaranje) {
      if (vremeRada.zatvaranje > vreme) {
        vreme += 2400;
      }
      vremeRada.zatvaranje += 2400;
    }
    if (vreme > vremeRada.otvaranje && vreme < vremeRada.zatvaranje) {
      return true;
    } else {
      return false
    }
  }
}

async function getWorking(id) {
  const danas = new Date();
  const datum = danas.getDay() + 1 + '.' + danas.getMonth + 1;
  const onajZon = await db.models.objectWorkTime.find({ where: { objectClId: id } });
  if (onajZon != null) {
    const specialDate = await db.models.objectSpecialTime.findAll({ where: { objectWorkTimeId: onajZon.id } })
    let isSpecialDate = false;
    let vremeRada = {}
    if (specialDate != null) {
      Promise.all(specialDate.map(item => {
        if (item.date == datum) {
          isSpecialDate = true;
          vremeRada.opening = item.opening
          vremeRada.closing = item.closing
        }
      }))
    }

    const dan = danas.getDay();
    const vreme = Number(danas.getHours().toString() + danas.getMinutes().toString());

    if (onajZon != null) {
      if (!isSpecialDate) {
        if (dan == 1) {
          if (onajZon.wtMonId != null) {
            const wtMon = await db.models.wtMon.find({ where: { id: onajZon.wtMonId } })
            vremeRada.opening = wtMon.opening;
            vremeRada.closing = wtMon.closing;
          } else {
            return false
          }
        }
        if (dan == 2) {
          if (onajZon.wtTueId != null) {
            const wtTue = await db.models.wtTue.find({ where: { id: onajZon.wtTueId } })
            vremeRada.opening = wtTue.opening;
            vremeRada.closing = wtTue.closing;
          } else {
            return false
          }
        }
        if (dan == 3) {
          if (onajZon.wtWedId != null) {
            const wtWed = await db.models.wtWed.find({ where: { id: onajZon.wtWedId } })
            vremeRada.opening = wtWed.opening
            vremeRada.closing = wtWed.closing
          } else {
            return false
          }
        }
        if (dan == 4) {
          if (onajZon.wtThuId != null) {
            const wtThu = await db.models.wtThu.find({ where: { id: onajZon.wtThuId } })
            vremeRada.opening = wtThu.opening
            vremeRada.closing = wtThu.closing
          } else {
            return false
          }
        }
        if (dan == 5) {
          if (onajZon.wtFriId != null) {
            const wtFri = await db.models.wtFri.find({ where: { id: onajZon.wtFriId } })
            vremeRada.opening = wtFri.opening
            vremeRada.closing = wtFri.closing
          } else {
            return false
          }
        }
        if (dan == 6) {
          if (onajZon.wtSatId != null) {
            const wtSat = await db.models.wtSat.find({ where: { id: onajZon.wtSatId } })
            vremeRada.opening = wtSat.opening
            vremeRada.closing = wtSat.closing
          } else {
            return false
          }
        }
        if (dan == 7) {
          if (onajZon.wtSunId != null) {
            const wtSun = await db.models.wtSun.find({ where: { id: onajZon.wtSunId } })
            vremeRada.opening = wtSun.opening
            vremeRada.closing = wtSun.closing
          } else {
            return false
          }
        }
      }

      if (vremeRada.opening > vremeRada.closing) {
        if (vremeRada.closing > vreme) {
          vreme += 2400;
        }
        vremeRada.closing += 2400;
      }
      if (vreme > vremeRada.opening && vreme < vremeRada.closing) {
        return true;
      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    return false
  }

}

export default {
  isWorking,
  getWorking
}