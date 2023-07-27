<template>
  <el-form
    :model="annonce"
    label-width="120px"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="title" prop="title">
      <el-input v-model="annonce.title" data-test="annonceFormtitle" />
    </el-form-item>
    <el-form-item label="content" prop="content">
      <el-input v-model="annonce.content" data-test="annonceFormcontent" />
    </el-form-item>
    <el-form-item label="userId" prop="userId">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="annonce.userId"
        data-test="annonceFormuserId"
      />
    </el-form-item>
    <el-form-item label="endDate" prop="endDate">
      <el-date-picker
        v-model="annonce.endDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="annonceFormendDate"
      />
    </el-form-item>
    <el-form-item label="annonceType" prop="annonceType">
      <el-input
        v-model="annonce.annonceType"
        data-test="annonceFormannonceType"
      />
    </el-form-item>
    <el-form-item label="longitude" prop="longitude">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="annonce.longitude"
        data-test="annonceFormlongitude"
      />
    </el-form-item>
    <el-form-item label="latitude" prop="latitude">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="annonce.latitude"
        data-test="annonceFormlatitude"
      />
    </el-form-item>
    <el-form-item label="interactions" prop="interactions">
      <el-input
        v-model="annonce.interactions"
        data-test="annonceForminteractions"
      />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="annonceFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="annonceFormSubmitButton"
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

import { useAnnonceStore } from "@/store/useAnnonceModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { annonce, error } = storeToRefs(useAnnonceStore());
const {
  getAnnonceById,
  createAnnonce,
  editAnnonce,
  resetAnnonce,
} = useAnnonceStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  title: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  content: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  userId: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  endDate: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  annonceType: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  longitude: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  latitude: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  interactions: [
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
    return await editAnnonce({ id });
  } else await createAnnonce();
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
        router.push({ name: `${currentUser.value.role}-list-annonce` });
        resetAnnonce();
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
  resetAnnonce();
};
const getCurrentAnnonce = async (id: string) => {
  if (props.isEdit) {
    await getAnnonceById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentAnnonce(id);
});
</script>
