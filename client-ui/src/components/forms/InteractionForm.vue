<template>
  <el-form
    :model="interaction"
    label-width="120px"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="userId" prop="userId">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="interaction.userId"
        data-test="interactionFormuserId"
      />
    </el-form-item>
    <el-form-item label="annonceId" prop="annonceId">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="interaction.annonceId"
        data-test="interactionFormannonceId"
      />
    </el-form-item>
    <el-form-item label="interactionType" prop="interactionType">
      <el-input
        v-model="interaction.interactionType"
        data-test="interactionForminteractionType"
      />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="interactionFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="interactionFormSubmitButton"
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

import { useInteractionStore } from "@/store/useInteractionModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { interaction, error } = storeToRefs(useInteractionStore());
const {
  getInteractionById,
  createInteraction,
  editInteraction,
  resetInteraction,
} = useInteractionStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  userId: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  annonceId: [
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
});

const handleSubmitForm = async () => {
  isLoading.value = true;
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editInteraction({ id });
  } else await createInteraction();
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
        router.push({ name: `${currentUser.value.role}-list-interaction` });
        resetInteraction();
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
  resetInteraction();
};
const getCurrentInteraction = async (id: string) => {
  if (props.isEdit) {
    await getInteractionById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentInteraction(id);
});
</script>
