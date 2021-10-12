# Feathers DataTable

Vuetify 2 data table that implements FeathersJS pagination

## Prerequisites

    npm install --save moment

## Installation

    npm install --save feathers-data-table

## Usage

This component can be used directly by importing and registering as a component.

    <template>
        <feathers-data-table service="users" :headers="headers"/>
    </template>
    <script>
    import { FeathersDataTable } from 'feathers-data-table';
    export default {
        name: 'app',
        components: {
            FeathersDataTable,
        },
        data() {
            return {
                headers: [
                  {text: 'Nombre', value: "name"},
                  {text: 'Email', value: "email"},
                ]
            };
        },
    };
    </script>

## Props

These are the available props of `FeathersDataTable`.

| Prop | Required | Type | Description |
| ---- | ---- | ---- | --- |
| `service` | Yes | String | The name of the feathersJS service |
| `headers` | Yes | List of `header` | This object defines the columns to be shown in the datatable |
| - `header.text` | Yes | String | Name of the column displayed in the table |
| - `header.value` | Yes | String | Name of the attribute of the model of feathers response to be mapped to the column  |
| - `header.sortable` | No | Boolean | Whether the column is sortable. If set to `true` the feathers service must support `$sort` in the query. Default: `true`  |
| - `header.labelMap` | No | Object: String -> String | Object to transform values of the response to texts  |
| - `header.classMap` | No | Object: String -> String | Object to apply css classes to cells based on values of response  |
| - `header.customslot` | No | Boolean | Whether to use a custom slot for the column. If set to `true` the property `header.itemslot` must be set. Default: `false`  |
| - `header.itemslot` | No | String | Name of the custom slot for the column when customslot is set to `true`  |
| `query` | No | Object | Feathers query object to merge with the internal query object for pagination  |
| `after-fetch` | No | Function | Fucntion to transform the feathers response. The function should return the transformed data.  |
| `sort-by` | No | String | Initial column to sort by.  |
