<template>
  <v-container v-if="loading" fluid>
    <v-row>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          type="heading, actions, table-thead, table-tbody, table-row-divider, table-row, table-tfoot"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <slot name="title">
                  <h1>Title</h1>
                </slot>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreate"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  <slot name="action">
                    Create
                  </slot>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card variant="elevated">
          <v-card-text>
            <slot name="content">
              <p>Text Content</p>
            </slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <slot name="dialogs"><p>Dialog</p></slot>
  </v-container>
</template>
<script lang="ts" setup>

  const emits = defineEmits(['create']);
  defineProps({
    loading: Boolean,
  })

  const openCreate = () => {
    emits('create')
  }

</script>
