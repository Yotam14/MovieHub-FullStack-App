import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import React from "react";

const Filter = ({ filters, handleFilterChange }) => {
  return (
    <div className="border-r border-gray-200 mt-4 sm:mt-20 ml-2 p-6 ">
      <form>
        {filters.map((section) => (
          <Disclosure as="div" key={section.id}>
            {({ open }) => (
              <>
                <h3 className="-mx-2 -my-3 flow-root">
                  <Disclosure.Button className="flex w-full-80 items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 hover:border-gray-200 border border-solid border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500">
                    <span className="font-medium text-gray-900 hover:text-gray-500 dark:text-gray-100">
                      Filter By Category
                    </span>
                    <span className="ml-6 flex items-center dark:text-gray-100">
                      {open ? (
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-2">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center"
                      >
                        <input
                          id={`filter-mobile-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          checked={option.checked}
                          onChange={() =>
                            handleFilterChange(optionIdx)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                        />
                        <label
                          htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                          className="ml-2 min-w-0 flex-1 text-gray-500 dark:text-gray-100"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </form>
    </div>
  );
};

export default Filter;
