import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable, { Column } from 'material-table';
import React from 'react';
import { forwardRef } from 'react';

import { Collection } from '../models/collection';
import { Entry } from '../models/entry';

const tableIcons = {
  Add: forwardRef<SVGSVGElement>((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef<SVGSVGElement>((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef<SVGSVGElement>((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef<SVGSVGElement>((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef<SVGSVGElement>((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef<SVGSVGElement>((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export const CollectionTable = (props: CollectionTableProps) => {
  return (
    <MaterialTable
      icons={tableIcons}
      options={{
        grouping: true
      }}
      columns={props.collection?.keys.map(getColumn) || []}
      data={props.collection?.entries || []}
      title={props.collection?.name || ''}
      isLoading={props.isLoading}
    />
  );
};

function getColumn(key: string): Column<Entry> {
  return {
    title: key,
    field: key,
    customFilterAndSearch
  };
}

function customFilterAndSearch(filter: string, rowData: Entry, columnDef: Column<Entry>): boolean {
  const searchTerms = filter.split(' ');
  const rowValues = Object.values(rowData);
  const rowIncludesSearchTerm = (searchTerm: string) =>
    rowValues.some(value => includesCaseInsensitive(value, searchTerm));
  return searchTerms.every(rowIncludesSearchTerm);
}

function includesCaseInsensitive(value: string, searchString: string) {
  return String(value)
    .toLowerCase()
    .includes(String(searchString).toLowerCase());
}

interface CollectionTableProps {
  collection: Collection | null;
  isLoading: boolean;
}
