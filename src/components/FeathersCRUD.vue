<template>
  <v-card class="elevation-3">
    <v-toolbar color="primary" dark class="elevation-2">
      <v-toolbar-title>Administrador de {{ name }}</v-toolbar-title>
      <v-spacer />
      <v-text-field
        label="Buscar"
        v-model="q"
        v-if="search"
        hide-details
        prepend-icon="search"
        clearable
      />
      <v-spacer v-if="search" />
      <v-btn color="white" outlined @click="openDialog">
        <v-icon>mdi-plus</v-icon>
        <span>Agregar</span>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pa-0">
      <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
      <v-card v-else class="elevation-0">
        <feathers-data-table
          :service="service"
          :raw="raw"
          :headers="headers"
          :actions="actions"
          @edit="openDialog"
          @remove="openRemoveEntityDialog"
          ref="table"
          :query="query"
        />
      </v-card>
    </v-card-text>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">{{ dialogTitle }}</span>
          <v-spacer></v-spacer>
          <v-btn color="white" outlined @click="saveEntity" v-if="!isEdit">
            Guardar
          </v-btn>
          <v-btn color="white" outlined @click="editEntity" v-else>
            Guardar
          </v-btn>
          <v-btn
            icon
            color="white"
            text
            @click="dialog = false"
            :loading="loading"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-form ref="dialogForm">
            <template v-for="field in dialogFields">
              <component v-bind="field" v-model="entity[field._key]" />
            </template>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            style="margin-right: 10px"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
          <v-btn color="primary" text @click="saveEntity" v-if="!isEdit">
            Guardar
          </v-btn>
          <v-btn color="primary" text @click="editEntity" v-else>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="removeDialog" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">
          ¿Está seguro de que quiere desactivar esta recurso ({{
            itemToRemove ? itemToRemove[item] : ""
          }})?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="closeRemoveEntityDialog">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="removeEntity(itemToRemove.id)">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import FeathersDataTable from "./FeathersDataTable";
import DatePickerB from "../utils/DatePickerB";
import ColorPicker from "../utils/ColorPicker";
import MyDatePicker from "../utils/MyDatePicker";

export default {
  name: "feathers-crud",
  components: {
    FeathersDataTable,
    DatePickerB,
    ColorPicker,
    MyDatePicker,
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      entity: null,
      dialog: false,
      removeDialog: false,
      itemToRemove: null,
      q: null,
    };
  },
  props: {
    attrs: Array,
    service: String,
    name: String,
    actions: Boolean,
    raw: Boolean,
    item: String,
    search: Boolean,
    searchColumns: Array,
  },
  created() {
    this.clearEntity();
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? "Editar " + this.name : "Agregar " + this.name;
    },
    dialogFields() {
      let f = this.attrs
        .filter((e) => e.inDialog || e.inDialog == null)
        .map((e) => ({
          is: e.fieldType,
          label: e.text,
          _key: e.key,
          ...e.fieldProps,
        }));
      return f;
    },
    headers() {
      let h = this.attrs
        .filter((e) => e.inTable || e.inTable == null)
        .map((e) => ({
          text: e.text,
          value: e.key,
          _class: e.itemClass,
          itemslot: "item." + e.key,
          labelMap: e.labelMap,
          classMap: e.classMap,
          sortable: e.sortable == null ? true : e.sortable,
        }));
      if (this.actions) {
        h.push({
          text: "Acciones",
          value: "actions",
          sortable: false,
        });
      }
      return h;
    },
    query() {
      if (this.search && this.searchColumns && this.q) {
        return {
          $or: this.searchColumns.map((e) => ({
            [e]: {
              $iLike: `%${this.q}%`,
            },
          })),
        };
      }
    },
  },
  methods: {
    saveEntity() {
      if (this.$refs.dialogForm.validate()) {
        this.loading = true;
        this.$service(this.service)
          .create(this.entity)
          .then((e) => {
            this.loading = false;
            if (this.$refs.table) this.$refs.table.getDataFromApi();
            this.dialog = false;
          });
      }
    },
    editEntity() {
      if (this.$refs.dialogForm.validate()) {
        this.loading = true;
        this.$service(this.service)
          .patch(this.entity.id, this.entity)
          .then((e) => {
            this.loading = false;
            if (this.$refs.table) this.$refs.table.getDataFromApi();
            this.dialog = false;
          });
      }
    },
    clearEntity() {
      this.entity = {};
      this.attrs
        .filter((e) => e.inDialog || e.inDialog == null)
        .forEach((e) => {
          this.entity[e.key] = null;
        });
    },
    openDialog(item) {
      this.clearEntity();
      this.isEdit = item != null;
      if (this.isEdit) {
        Object.assign(this.entity, item);
        this.attrs.forEach((elem, index) => {
          if (elem.fieldType === "v-select" && elem.spanish) {
            this.entity[elem.key] = this.entity[elem.key] === "Si";
          }
        });
      }

      this.dialog = true;
    },
    openRemoveEntityDialog(item) {
      this.itemToRemove = item;
      this.removeDialog = true;
    },
    closeRemoveEntityDialog() {
      this.itemToRemove = null;
      this.removeDialog = false;
    },
    removeEntity(id) {
      this.$service(this.service)
        .remove(id)
        .then((_) => {
          if (this.$refs.table) {
            this.$refs.table.getDataFromApi();
            this.closeRemoveEntityDialog();
          }
        });
    },
  },
};
</script>
