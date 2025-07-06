<template>
    <div
        class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
        <div class="animate-fade-in">
            <div
                class="card max-w-md w-full p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl"
            >
                <div class="text-center mb-8">
                    <div
                        class="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4"
                    >
                        <svg
                            class="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>
                    <p class="text-gray-600">Tạo tài khoản mới để bắt đầu chat</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-6">
                    <div class="space-y-4">
                        <div>
                            <label
                                for="username"
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Tên người dùng
                            </label>
                            <input
                                type="text"
                                id="username"
                                v-model="username"
                                required
                                placeholder="Nhập tên người dùng"
                                class="input-field"
                                :class="{ 'border-red-300 focus:ring-red-500': error }"
                            />
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                v-model="email"
                                required
                                placeholder="Nhập địa chỉ email"
                                class="input-field"
                                :class="{ 'border-red-300 focus:ring-red-500': error }"
                            />
                        </div>

                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                v-model="password"
                                required
                                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                class="input-field"
                                :class="{ 'border-red-300 focus:ring-red-500': error }"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="btn btn-primary w-full py-3 text-lg relative"
                        :class="{ 'opacity-75 cursor-not-allowed': loading }"
                    >
                        <span v-if="loading" class="flex items-center justify-center">
                            <svg
                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Đang đăng ký...
                        </span>
                        <span v-else>Đăng ký</span>
                    </button>

                    <div v-if="error" class="animate-slide-up">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div class="flex">
                                <svg
                                    class="h-5 w-5 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div class="ml-3">
                                    <p class="text-sm text-red-800">{{ error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="mt-8 pt-6 border-t border-gray-200">
                    <p class="text-center text-sm text-gray-600">
                        Đã có tài khoản?
                        <router-link
                            to="/login"
                            class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                            Đăng nhập ngay
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
    loading.value = true;
    error.value = '';

    const result = await authStore.register(username.value, email.value, password.value);

    if (result.success) {
        router.push('/chat');
    } else {
        error.value = result.error || 'Đăng ký thất bại';
    }

    loading.value = false;
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
