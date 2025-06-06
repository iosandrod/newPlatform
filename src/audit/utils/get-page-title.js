import defaultSettings from "@/audit/settings";

const title = defaultSettings.title;

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
