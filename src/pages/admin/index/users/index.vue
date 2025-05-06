<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <p>
                  User List
                </p>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreateDialog"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Create User
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
            <v-data-table
              :headers="headers"
              :items="users == null ? [] : users"
              :loading="loading"
              no-data-text="No users found."
              no-results-text="No matching users found."
            >
              <template #[`item.userRole`]="{ item }">
                <v-chip
                  :color="getRoleColor(item.userRole)"
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
                    @click="openEditDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    title="Delete User"
                    @click="openDeleteDialog(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog.show" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete user: <strong>{{ deleteDialog.user?.username }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red" :loading="deleteDialog.loading" @click="confirmDeleteUser">
            <span v-if="deleteDialog.loading">Deleting...</span>
            <span v-else>Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          {{ editMode === 'create' ? 'Create User' : 'Edit User' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field
              v-model="editDialog.user.email"
              label="Email"
              required
              :rules="emailRules"
            />
            <v-text-field
              v-model="editDialog.user.username"
              label="Username"
              required
              :rules="usernameRules"
            />
            <v-select
              v-model="editDialog.user.userRole"
              :items="userRoles"
              label="User Role"
              required
              :rules="roleRules"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeEditDialog">Cancel</v-btn>
          <v-btn
            color="blue"
            :disabled="!editFormValid"
            :loading="editDialog.loading"
            @click="saveEditUser"
          >
            <span v-if="editDialog.loading">Saving...</span>
            <span v-else>Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { VForm } from 'vuetify/components';
  import { type User, UserRole } from '@/models/user';
  import { useApi } from '@/composables/api';

  const headers = [
    { title: 'User ID', value: 'userId', width: '30%' },
    { title: 'Email', value: 'email', width: '25%' },
    { title: 'Username', value: 'username', width: '20%' },
    { title: 'Role', value: 'userRole', width: '15%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '10%' },
  ];
  const { data: users, loading: loading } = useApi<User[]>('http://localhost:9099/api/v1/user');

  const deleteDialog = ref({
    show: false,
    user: null as User | null,
    loading: false,
  });

  const editDialog = ref({
    show: false,
    user: {} as User,
    loading: false,
  });
  const editFormValid = ref(false);
  const editForm = ref<VForm | null>(null);
  const editMode = ref<'create' | 'edit'>('edit');

  const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];
  const usernameRules = [
    (v: string) => !!v || 'Username is required',
    (v: string) => v.length >= 3 || 'Username must be at least 3 characters',
  ];
  const roleRules = [
    (v: string) => !!v || 'User Role is required',
  ]
  const userRoles = Object.values(UserRole);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'red';
      case UserRole.PRESENTER:
        return 'primary';
      case UserRole.AUDIENCE:
        return 'secondary';
      default:
        return 'grey';
    }
  };

  const openDeleteDialog = (user: User) => {
    deleteDialog.value = {
      show: true,
      user,
      loading: false,
    };
  };

  const closeDeleteDialog = () => {
    deleteDialog.value.show = false;
    deleteDialog.value.user = null;
  };

  const confirmDeleteUser = () => {
    if (!deleteDialog.value.user) return;

    deleteDialog.value.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting user:', deleteDialog.value.user);
      // Remove the user from the list
      if(users.value != null) {
        users.value = users.value.filter(u => u.userId !== deleteDialog.value.user!.userId);
      }
      deleteDialog.value.loading = false;
      closeDeleteDialog();
    }, 500);
  };

  const openEditDialog = (user: User) => {
    editMode.value = 'edit';
    editDialog.value = {
      show: true,
      user: { ...user },
      loading: false,
    };
  };

  const openCreateDialog = () => {
    editMode.value = 'create';
    editDialog.value = {
      show: true,
      user: {
        userId: '',
        email: '',
        username: '',
        userRole: UserRole.AUDIENCE, // Default role
      },
      loading: false,
    };
  };

  const closeEditDialog = () => {
    editDialog.value.show = false;
    editDialog.value.user = {} as User;
  };

  const saveEditUser = () => {
    if (!editForm.value?.validate()) return;

    editDialog.value.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving user:', editDialog.value.user);
      if (editMode.value === 'edit'){
        if(users.value != null) {
          users.value = users.value.map(u =>
            u.userId === editDialog.value.user.userId ? { ...editDialog.value.user } : u
          );
        }
      }
      else{
        const newUser = {
          ...editDialog.value.user,
          userId: crypto.randomUUID(), // Generate a new ID
        };
        if(users.value != null) {
          users.value.push(newUser);
        }
      }

      editDialog.value.loading = false;
      closeEditDialog();
    }, 500);
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "Users",
      "requiresAuth": true
    }
  }
  </route>
