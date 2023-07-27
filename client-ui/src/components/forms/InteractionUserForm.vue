<template>
  <el-form
    :model="interactionuser"
    label-width="120px"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="userId_1" prop="userId_1">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="interactionuser.userId_1"
        data-test="interactionuserFormuserId_1"
      />
    </el-form-item>
    <el-form-item label="userId_2" prop="userId_2">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="interactionuser.userId_2"
        data-test="interactionuserFormuserId_2"
      />
    </el-form-item>
    <el-form-item label="interactionType" prop="interactionType">
      <el-input
        v-model="interactionuser.interactionType"
        data-test="interactionuserForminteractionType"
      />
    </el-form-item>
    <el-form-item label="date" prop="date">
      <el-date-picker
        v-model="interactionuser.date"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="interactionuserFormdate"
      />
    </el-form-item>
    <el-form-item label="status" prop="status">
      <el-input
        v-model="interactionuser.status"
        data-test="interactionuserFormstatus"
      />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="interactionuserFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="interactionuserFormSubmitButton"
        type="primary"
        @click="onSubmit(ruleFormRef)"
        >{{ isEdit ? "Save" : "Create" }}</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "@/core/services/SupabaseClientService";

import { useInteractionUserStore } from "@/store/useInteractionUserModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { interactionuser, error } = storeToRefs(useInteractionUserStore());
const {
  getInteractionUserById,
  createInteractionUser,
  editInteractionUser,
  resetInteractionUser,
} = useInteractionUserStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  userId_1: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  userId_2: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  interactionType: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  date: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  status: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handleSubmitForm = async () => {
  isLoading.value = true;
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editInteractionUser({ id });
  } else await createInteractionUser();
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        router.push({ name: `${currentUser.value.role}-list-interactionuser` });
        resetInteractionUser();
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  resetInteractionUser();
};
const getCurrentInteractionUser = async (id: string) => {
  if (props.isEdit) {
    await getInteractionUserById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentInteractionUser(id);
});
</script>
