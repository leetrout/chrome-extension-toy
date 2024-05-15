import { createChromeStorageStateHookLocal } from 'use-chrome-storage';

export type Hostname = string;

export type HostStat = {
  count: number;
};

export type HostStatsMapping = {
  [key: Hostname]: HostStat;
};

export type HostStats = {
  hosts: HostStatsMapping;
};

// TODO unused
export type WordStat = {
  count: number;
  hosts: Set<string>;
};

/** getHostname returns the hostname for the given URL. */
export function getHostname(url: string): Hostname {
  const parsed = new URL(url);
  return parsed.hostname as Hostname;
}

export const CHROME_STORAGE_HOSTS_KEY = 'profanity-hosts';
const INITIAL_HOSTSTATS_VALUE: HostStats = {
  hosts: {},
};

export const useHostStats = createChromeStorageStateHookLocal(
  CHROME_STORAGE_HOSTS_KEY,
  INITIAL_HOSTSTATS_VALUE
);

type NamespacedGetterSetterPair<T> = [Promise<T>, (val: T) => Promise<void>];

/** Storage helper factory so the namespace is invisible to the caller.
 * Returns a getter and a setter for the given storage area and namespace.
 */
function makeNamespacedStorageHelper<T>(
  storage: chrome.storage.LocalStorageArea,
  namespaceKey: string
): [Promise<T>, (val: T) => Promise<void>] {
  return [
    storage.get(namespaceKey).then((x) => x[namespaceKey] || {}) as Promise<T>,
    (val: T) => {
      const setterObj: { [key: string]: T } = {};
      setterObj[namespaceKey] = val;
      return storage.set(setterObj);
    },
  ];
}

export function getHostStorage(
  storage: chrome.storage.LocalStorageArea
): NamespacedGetterSetterPair<HostStats> {
  return makeNamespacedStorageHelper<HostStats>(
    storage,
    CHROME_STORAGE_HOSTS_KEY
  );
}
