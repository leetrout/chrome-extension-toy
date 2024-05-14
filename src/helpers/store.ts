import { createChromeStorageStateHookLocal } from 'use-chrome-storage';

export type Hostname = string;

export type HostStat = {
  count: number;
  words: Set<string>;
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

const CHROME_STORAGE_KEY = 'profanity-settings';
const INITIAL_VALUE = {
  hostStats: {},
  meta: {
    installDate: new Date().getTime(),
  },
};

export const useLocalChromeStore = createChromeStorageStateHookLocal(
  CHROME_STORAGE_KEY,
  INITIAL_VALUE
);

const CHROME_STORAGE_HOSTS_KEY = 'profanity-hosts';
const INITIAL_HOSTSTATS_VALUE: HostStats = {
  hosts: {},
};

export const useHostStats = createChromeStorageStateHookLocal(
  CHROME_STORAGE_HOSTS_KEY,
  INITIAL_HOSTSTATS_VALUE
);
