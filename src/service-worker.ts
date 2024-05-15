import { getHostname, getHostStorage } from './helpers/store';

async function saveHostStats(url: string, count: number) {
  // Only save the hostname not the full URL
  const hostname = getHostname(url);
  console.log({ hostname });

  const [maybeStats, setStats] = getHostStorage(chrome.storage.local);
  const stats = await maybeStats;
  stats.hosts = stats.hosts || {};

  let hostData = stats.hosts[hostname];
  if (hostData === undefined) {
    hostData = { count };
  } else {
    hostData.count += count;
  }
  stats.hosts[hostname] = hostData;

  await setStats(stats);
}

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (sender === undefined || sender.tab === undefined) {
      console.error('sender or tab missing');
      return;
    }
    if (request.stats) {
      chrome.action.setBadgeBackgroundColor({
        color: '#cdcdcd',
        tabId: sender.tab.id,
      });
      chrome.action.setBadgeText({
        text: `${request.stats}`,
        tabId: sender.tab.id,
      });
      await saveHostStats(sender.tab.url || 'unknown', request.stats);
      sendResponse(true);
    }
  }
);

export {};
