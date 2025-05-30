import { ResponseError } from '@/models/error';
import type { TableOption } from '@/models/table';
import { type User, type UserRole, userRoleSchema } from '@/models/user';
import { userService } from '@/services/user';
import { simulateDelay } from '@/utils/delay';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class UserViewModel {
  private listUser: User[] = []
  readonly headers = [
    { title: 'Username', key: 'username', sortable: false },
    { title: 'Email', key: 'email', sortable: false },
    { title: 'Role', key: 'userRole', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  readonly emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];
  readonly usernameRules = [
    (v: string) => !!v || 'Username is required',
    (v: string) => v.length >= 3 || 'Username must be at least 3 characters',
  ];
  readonly roleRules = [
    (v: string) => !!v || 'User Role is required',
  ]

  readonly userRoles = Object.values(userRoleSchema.Enum)

  listUserModel = reactive({
    itemsPerPage: 10,
    totalUsers: 0,
    loading: false,
    users: this.listUser,
  })

  editForm = ref<VForm | null>(null);

  editMode = ref(false)
  editFormValid = ref(false);

  deleteDialog = reactive({
    show: false,
    loading: false,
    user: null as User | null,

  })

  editDialog = reactive({
    show: false,
    loading: false,
    user: {} as User,
  })

  readonly fetchListUser = async (option: TableOption) => {
    this.listUserModel.loading = true
    try {
      await simulateDelay();
      const users = await userService.getUsers(option)
      this.listUserModel.users = users.data;
      this.listUserModel.totalUsers = users.totalElements;
    } catch (error) {
      if (error instanceof ResponseError) {
        console.log(error.errors);
      }
    } finally {
      this.listUserModel.loading = false
    }
  }

  openCreateDialog () {
    this.editMode.value = false;
    this.editDialog.show = true;
    this.editDialog.user = {
      userId: '',
      email: '',
      username: '',
      userRole: 'AUDIENCE',
    }
    this.editDialog.loading = false
  }

  getRoleColor (userRole: UserRole): string {
    switch (userRole) {
      case userRoleSchema.Enum.ADMIN:
        return 'red';
      case userRoleSchema.Enum.PRESENTER:
        return 'primary';
      case userRoleSchema.Enum.AUDIENCE:
        return 'secondary';
      default:
        return 'grey';
    }
  }

  openEditDialog (user: User) {
    this.editMode.value = true;
    this.editDialog.loading = false;
    this.editDialog.user = user;
    this.editDialog.show = true;
  }

  openDeleteDialog (user: User) {
    this.deleteDialog.show = true
    this.deleteDialog.loading = false
    this.deleteDialog.user = user
  }

  closeDeleteDialog () {
    this.deleteDialog.show = false;
    this.deleteDialog.user = null;
  }

  confirmDeleteUser () {
    if (!this.deleteDialog.user) return;

    this.deleteDialog.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting user:', this.deleteDialog.user);
      // Remove the user from the list
      if(this.listUserModel.users.length > 0) {
        this.listUserModel.users = this.listUserModel.users.filter(u => u.userId !== this.deleteDialog.user!.userId);
      }
      this.deleteDialog.loading = false;
      this.closeDeleteDialog();
    }, 500);
  }

  closeEditDialog () {
    this.editDialog.show = false;
    this.editDialog.user = {} as User;
  }

  saveEditUser () {
    console.log('save click...')
    if (!this.editForm.value?.validate()) return;
    this.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving user:', this.editDialog.user);
      if (this.editMode.value){
        if(this.listUserModel.users.length > 0) {
          this.listUserModel.users = this.listUserModel.users.map(u =>
            u.userId === this.editDialog.user.userId ? { ...this.editDialog.user } : u
          );
        }
      }
      else{
        const newUser = {
          ...this.editDialog.user,
          userId: crypto.randomUUID(), // Generate a new ID
        };
        if(this.listUserModel.users.length != null) {
          this.listUserModel.users.push(newUser);
        }
      }

      this.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  }
}

export const userViewModel = new UserViewModel();
