import { CheckIcon } from '@heroicons/react/24/outline';

import { getHostname, useHostStats } from '../helpers/store';
import './App.css';
import { useEffect, useState } from 'react';

export default function Action() {
  const [hostStats] = useHostStats();
  const [currentCount, setCurrentCount] = useState(0);
  const [currentDomain, setCurrentDomain] = useState('unknown');

  // https://stackoverflow.com/questions/28786723/why-doesnt-chrome-tabs-query-return-the-tabs-url-when-called-using-requirejs
  useEffect(() => {
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => {
        if (tab == undefined) {
          return;
        }
        const domain = getHostname(tab.url || 'unknown');
        setCurrentDomain(domain);
        const stats = hostStats.hosts[domain];
        if (stats) setCurrentCount(hostStats.hosts[domain].count);
      });
  });

  return (
    <div className="App">
      <div className="inset-0 z-10 w-screen">
        <div className="min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Profanity Filter Toy
              </h3>
              <div className="mt-2">
                {/* TODO: Current tab stats */}
                <p>
                  {currentCount} censored on {currentDomain} for all time.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <a
              href="options.html"
              target="_blank"
              className="bg-indigo-100 text-indigo-700 rounded-md px-3 py-2 text-sm font-medium"
            >
              Options
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
