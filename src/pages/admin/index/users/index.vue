<template>
  <main-content-list :loading="false" @create="userViewModel.openCreateDialog()">
    <template #title>
      User List
    </template>
    <template #action>
      Create User
    </template>
    <template #content>
      <v-data-table-server
        v-model:items-per-page="userViewModel.listUserModel.itemsPerPage"
        :headers="userViewModel.headers"
        :items="userViewModel.listUserModel.users"
        :items-length="userViewModel.listUserModel.totalUsers"
        :loading="userViewModel.listUserModel.loading"
        no-data-text="No users found."
        no-results-text="No matching users found."
        @update:options="userViewModel.fetchListUser"
      >
        <template #[`item.userRole`]="{ item }">
          <v-chip
            :color="userViewModel.getRoleColor(item.userRole)"
          >
            {{ item.userRole }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              color="primary"
              icon
              size="small"
              title="Edit User"
              @click="userViewModel.openEditDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="error"
              icon
              size="small"
              title="Delete User"
              @click="userViewModel.openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </template>
    <template #dialogs>
      <v-dialog v-model="userViewModel.deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete user: <strong>{{ userViewModel.deleteDialog.user?.username }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="userViewModel.closeDeleteDialog()">Cancel</v-btn>
            <v-btn color="red" :loading="userViewModel.deleteDialog.loading" @click="userViewModel.confirmDeleteUser()">
              <span v-if="userViewModel.deleteDialog.loading">Deleting...</span>
              <span v-else>Delete</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="userViewModel.editDialog.show" max-width="500">
        <v-card>
          <v-card-title>
            {{ userViewModel.editMode.value ? 'Edit User' : 'Create User' }}
          </v-card-title>
          <v-card-text>
            <v-form :ref="userViewModel.editForm" v-model="userViewModel.editFormValid.value">
              <v-text-field
                v-model="userViewModel.editDialog.user!.email"
                label="Email"
                required
                :rules="userViewModel.emailRules"
              />
              <v-text-field
                v-model="userViewModel.editDialog.user!.username"
                label="Username"
                required
                :rules="userViewModel.usernameRules"
              />
              <v-select
                v-model="userViewModel.editDialog.user!.userRole"
                :items="userViewModel.userRoles"
                label="User Role"
                required
                :rules="userViewModel.roleRules"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="userViewModel.closeEditDialog()">Cancel</v-btn>
            <v-btn
              color="blue"
              :disabled="!userViewModel.editFormValid.value"
              :loading="userViewModel.editDialog.loading"
              @click="userViewModel.saveEditUser()"
            >
              <span v-if="userViewModel.editDialog.loading">Saving...</span>
              <span v-else>Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </main-content-list>
</template>

<script lang="ts" setup>
  import { userViewModel } from '@/viewmodel/user';
</script>
<route lang="json">
  {
    "meta": {
      "title": "Users",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
  </route>
