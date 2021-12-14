<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="total"
    :loading="loading"
    :footer-props="footerProps"
    @click:row="clickRowHandler"
    :must-sort="sortBy != null"
    :sort-by="sortBy ? sortBy : null"
    :item-class="(item) => rowClasses(item)"
  >
    <template v-slot:[attr.itemslot]="{ item }" v-for="attr in headers">
      <div :class="attr.classMap ? attr.classMap[item[attr.value]] : attr._class" v-if="!attr.customslot" v-html="attr.labelMap ? attr.labelMap[item[attr.value]] : item[attr.value]"></div>
      <slot v-else :name="attr.itemslot" :item="item" />
    </template>
    <template #item.actions="{ item }">
      <v-row>
        <v-btn color="primary" small text icon @click="editHandler(item)">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon v-on="on">{{
                isEdit ? "mdi-pencil" : "mdi-import"
              }}</v-icon>
            </template>
            <span>{{ isEdit ? "Editar" : "Detalles" }}</span>
          </v-tooltip>
        </v-btn>
        <v-btn color="primary" small text icon @click="removeHandler(item)">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon v-on="on">{{
                item.active ? "mdi-delete" : "mdi-delete-restore"
              }}</v-icon>
            </template>
            <span>{{ item.active ? "Desactivar" : "Activar" }}</span>
          </v-tooltip>
        </v-btn>
      </v-row>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "FeathersDataTable",
  data() {
    return {
      total: 0,
      items: [],
      loading: true,
      footerProps: {
        "items-per-page-options": [10, 25, 50],
      },
      options: {},
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    // this.getDataFromApi()
  },
  methods: {
    getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      // console.log(this.options);

      let q = {
        query: {
          $limit: itemsPerPage,
          $skip: (page - 1) * itemsPerPage,
          $sort:
            sortBy.length > 0
              ? {
                  [sortBy[0]]: sortDesc[0] ? -1 : 1,
                }
              : undefined,
        },
      };

      if (this.query) {
        q.query = { ...q.query, ...this.query };
      }
      let client = this.feathersClient ? this.feathersClient : this.$service;
      client(this.service)
        .find(q)
        .then(async (data) => {
          if (this.afterFetch != null) {
            this.items = await this.afterFetch(data.data);
          } else {
            this.items = data.data;
          }
          this.total = data.total;
          this.loading = false;
        });
    },
    editHandler(item) {
      this.$emit("edit", item);
    },
    removeHandler(item) {
      this.$emit("remove", item);
    },
    clickRowHandler(item) {
      this.$emit("click:row", item);
    },
    rowClasses(item) {
      if (item[this.highlightRow]) {
        return "highlight-row";
      }
    },
  },
  props: {
    headers: Array,
    service: String,
    query: Object,
    sortBy: String,
    afterFetch: Function,
    isEdit: {
      type: Boolean,
      default: true,
    },
    highlightRow: {
      type: String,
      allowNull: true,
    },
    feathersClient: Object
  },
};
</script>

<style>
.highlight-row {
  background-color: #ff8c84;
}
</style>
