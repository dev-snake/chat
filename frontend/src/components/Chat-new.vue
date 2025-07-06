<template>
    <div class="h-screen bg-gray-50 flex flex-col">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
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
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-semibold text-gray-900">Chat App</h1>
                        <p class="text-sm text-gray-500">
                            Xin chào, {{ authStore.user?.username }}!
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <div
                            class="h-2 w-2 rounded-full"
                            :class="connected ? 'bg-green-400' : 'bg-red-400'"
                        ></div>
                        <span
                            class="text-sm"
                            :class="connected ? 'text-green-600' : 'text-red-600'"
                        >
                            {{ connected ? 'Đã kết nối' : 'Mất kết nối' }}
                        </span>
                    </div>
                    <button @click="handleLogout" class="btn btn-secondary text-sm px-4 py-2">
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>

        <!-- Messages Container -->
        <div class="flex-1 overflow-hidden">
            <div ref="messagesContainer" class="h-full overflow-y-auto px-6 py-4 space-y-4">
                <div
                    v-for="message in messages"
                    :key="message.id"
                    class="animate-slide-up"
                    :class="
                        message.senderId === authStore.user?.id
                            ? 'flex justify-end'
                            : 'flex justify-start'
                    "
                >
                    <div
                        class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm"
                        :class="
                            message.senderId === authStore.user?.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                        "
                    >
                        <div
                            class="text-xs mb-1 opacity-75"
                            :class="
                                message.senderId === authStore.user?.id
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                            "
                        >
                            <span class="font-medium">{{
                                message.sender?.username || 'Unknown'
                            }}</span>
                            <span class="ml-2">{{ formatTime(message.createdAt) }}</span>
                        </div>
                        <div class="text-sm">{{ message.content }}</div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="messages.length === 0" class="text-center py-12">
                    <div
                        class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                    >
                        <svg
                            class="h-8 w-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có tin nhắn nào</h3>
                    <p class="text-gray-500">
                        Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!
                    </p>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="bg-white border-t border-gray-200 px-6 py-4">
            <form @submit.prevent="sendMessage" class="flex space-x-3">
                <div class="flex-1">
                    <input
                        type="text"
                        v-model="newMessage"
                        placeholder="Nhập tin nhắn..."
                        :disabled="!connected"
                        class="input-field"
                        :class="{ 'opacity-50 cursor-not-allowed': !connected }"
                    />
                </div>
                <button
                    type="submit"
                    :disabled="!newMessage.trim() || !connected"
                    class="btn btn-primary px-6 py-3 flex items-center space-x-2"
                    :class="{ 'opacity-50 cursor-not-allowed': !newMessage.trim() || !connected }"
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                    <span>Gửi</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    sender?: {
        username: string;
    };
}

const router = useRouter();
const authStore = useAuthStore();

const messages = ref<Message[]>([]);
const newMessage = ref('');
const connected = ref(false);
const messagesContainer = ref<HTMLElement>();

let socket: Socket;

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const sendMessage = () => {
    if (newMessage.value.trim() && connected.value && authStore.user) {
        socket.emit('sendMessage', {
            content: newMessage.value.trim(),
            userId: authStore.user.id,
        });
        newMessage.value = '';
    }
};

const handleLogout = () => {
    if (socket) {
        socket.disconnect();
    }
    authStore.logout();
    router.push('/login');
};

onMounted(() => {
    authStore.initializeAuth();

    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }

    // Connect to WebSocket
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        connected.value = true;
        console.log('Connected to server');

        // Get all messages
        socket.emit('getMessages');
    });

    socket.on('disconnect', () => {
        connected.value = false;
        console.log('Disconnected from server');
    });

    socket.on('allMessages', (allMessages: Message[]) => {
        messages.value = allMessages;
        scrollToBottom();
    });

    socket.on('newMessage', (message: Message) => {
        messages.value.push(message);
        scrollToBottom();
    });
});

onUnmounted(() => {
    if (socket) {
        socket.disconnect();
    }
});
</script>

<style scoped>
/* Custom animations that complement Tailwind */
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
}

.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}
</style>
