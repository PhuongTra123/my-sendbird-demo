import { format, isValid, formatDistanceToNowStrict } from "date-fns";
// import { enGB } from 'date-fns/locale'

export const formatDate = (d, o) => {
  return isValid(d) ? format(d, o) : "";
};

export const distanceToNow = (value) => {
  return `${formatDistanceToNowStrict(new Date(value))} ago`
}