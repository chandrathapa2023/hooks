import { Hit as AlgoliaHit } from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import {
  InstantSearch,
  Breadcrumb,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  Highlight,
  Hits,
  HitsPerPage,
  InfiniteHits,
  Menu,
  Pagination,
  RangeInput,
  RefinementList,
  PoweredBy,
  SearchBox,
  SortBy,
  ToggleRefinement,
} from 'react-instantsearch-hooks-web';

import {
  NumericMenu,
  Panel,
  QueryRuleContext,
  QueryRuleCustomData,
  Refresh,
} from './components';
import { Tab, Tabs } from './components/layout';

import './App.css';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

export function App() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="instant_search"
      routing={true}
    >
      <Configure ruleContexts={[]} />

      <div className="Container">
        <div>
          <DynamicWidgets>
            <Panel header="Brands">
              <RefinementList
                attribute="brand"
                searchable={true}
                searchablePlaceholder="Search brands"
                showMore={true}
              />
            </Panel>
            <Panel header="Categories">
              <Menu attribute="categories" showMore={true} />
            </Panel>
            <Panel header="Hierarchy">
              <HierarchicalMenu
                attributes={[
                  'hierarchicalCategories.lvl0',
                  'hierarchicalCategories.lvl1',
                  'hierarchicalCategories.lvl2',
                ]}
                showMore={true}
              />
            </Panel>
            <Panel header="Price Range">
              <NumericMenu
                attribute="price"
                items={[
                  { label: "Under 200", end: 200 },
                  { label: "200 to 500", start: 200, end: 500 },
                  { label: "500 to 1000", start: 500, end: 1000 },
                  { label: "1000 to 2000", start: 1000, end: 2000 },
                  { label: "2000 to 4000", start: 2000, end: 4000 },
                  { label: "4000 to 6000", start: 4000, end: 6000 },
                  { label: "6000 to 8000", start: 6000, end: 8000 },
                  { label: "Over 8000", start: 8000 },
                  { label: "All" },
                ]}
              />
            </Panel>
            <Panel header="Free Shipping">
              <ToggleRefinement
                attribute="free_shipping"
                label="Free shipping"
              />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="Search">
          <Breadcrumb
            attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
            ]}
          />

          <SearchBox placeholder="Search" autoFocus />

          <div className="Search-header">
            <PoweredBy />
            <HitsPerPage
              items={[
                { label: '20 hits per page', value: 20, default: true },
                { label: '40 hits per page', value: 40 },
              ]}
            />
            <SortBy
              items={[
                { label: 'Relevance', value: 'instant_search' },
                { label: 'Price (asc)', value: 'instant_search_price_asc' },
                { label: 'Price (desc)', value: 'instant_search_price_desc' },
              ]}
            />
            <Refresh />
          </div>

          <div className="CurrentRefinements">
            <ClearRefinements />
            <CurrentRefinements
              transformItems={(items) =>
                items.map((item) => {
                  const label = item.label.startsWith('hierarchicalCategories')
                    ? 'Hierarchy'
                    : item.label;

                  return {
                    ...item,
                    attribute: label,
                  };
                })
              }
            />
          </div>

          <QueryRuleContext
            trackedFilters={{
              brand: () => ['Apple'],
            }}
          />

          <QueryRuleCustomData>
            {({ items }) => (
              <>
                {items.map((item) => (
                  <a href={item.link} key={item.banner}>
                    <img src={item.banner} alt={item.title} />
                  </a>
                ))}
              </>
            )}
          </QueryRuleCustomData>

          <Tabs>
            <Tab title="Hits">
              <Hits hitComponent={Hit} />
              <Pagination className="Pagination" />
            </Tab>
            <Tab title="InfiniteHits">
              <InfiniteHits showPrevious hitComponent={Hit} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </InstantSearch>
  );
}
