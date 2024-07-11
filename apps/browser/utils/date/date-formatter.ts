import humanizeDuration from "humanize-duration";

export default function useDateFormatter() {
  function durationFormat(
    dateStr: string,
    suffix: string = " ago",
    force: boolean = false,
    lowerCase: boolean = false,
    alwaysHumanize: boolean = false,
    showSeconds: boolean = false
  ): string {
    if (!dateStr || dateStr.length === 0) {
      return "";
    }

    const date = new Date(dateStr);
    const time = Math.abs((Date.now() - date.getTime()) / 1000.0);

    let result = "";

    if (time < 60) {
      if (showSeconds) {
        result = Math.floor(time) + "s";
      } else {
        result = "Moments" + suffix;
      }
    } else {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      if (!force && date.getTime() <= monthAgo.getTime() && !alwaysHumanize) {
        return Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(date);
      }

      result = humanizeDuration(date.getTime() - Date.now(), { largest: 1, round: true }) + suffix;
    }

    if (lowerCase) {
      return result.toLowerCase();
    }

    return result;
  }

  function dateFormat(dateStr: string) {
    const date = new Date(dateStr);
    return Intl.DateTimeFormat("en-US").format(date);
  }

  function longDateFormat(dateStr: string, showWeekday: boolean = false) {
    const date = new Date(dateStr);

    const options = showWeekday
      ? {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        }
      : {
          year: "numeric",
          month: "long",
          day: "numeric",
        };

    return Intl.DateTimeFormat("en-US", <any>options).format(date);
  }

  function longDateTimeFormat(dateStr: string) {
    const date = new Date(dateStr);
    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  function dateTimeFormat(dateStr: string|Date) {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  function shortDateTimeFormat(date: string | Date) {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(date);
  }

  return {
    dateFormat,
    longDateFormat,
    longDateTimeFormat,
    shortDateTimeFormat,
    durationFormat,
    dateTimeFormat,
  };
}
