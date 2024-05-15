import React from 'react';
import { HostStats, useHostStats } from '../helpers/store';
import './App.css';

const tabs = [
  { name: 'Stats', href: '#', current: true },
  { name: 'Config (TODO)', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function HostStatsTable(props: { hostStats: HostStats }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Censored words by host
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of hostnames and the number of censored words on each domain.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Clear (TODO)
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Host
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    Censored words
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Object.entries(props.hostStats.hosts)
                  .sort(([, statsA], [, statsB]) => statsB.count - statsA.count)
                  .map(([host, stats]) => (
                    <tr key={host} className="even:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 text-left">
                        {host}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                        {stats.count}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card(props: React.PropsWithChildren) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
          Profanity Filter Toy
        </h1>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <Tabs></Tabs>
      </div>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}

function Tabs() {
  return (
    <div>
      <div className="">
        <nav
          className="flex flex-row space-x-4 items-center justify-center"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.current
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium'
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Options() {
  const [hostStats] = useHostStats();
  return (
    <div className="App">
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-2xl p-12">
          <Card>
            <HostStatsTable hostStats={hostStats}></HostStatsTable>
          </Card>
        </div>
      </div>
    </div>
  );
}
