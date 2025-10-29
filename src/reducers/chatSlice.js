import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi, convHistoryApi, chatHistoryApi, chatStreamApi } from "@/services/api";

//createAsyncThunk([slice name]/[action name], callback function) for fetching messages
export const chat = createAsyncThunk("chat/chat", async (payload, { rejectWithValue }) => {
  try {
    return await chatApi(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const convHistory = createAsyncThunk("chat/convHistory", async (params, { rejectWithValue }) => {
  try {
    return await convHistoryApi(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const chatHistory = createAsyncThunk("chat/chatHistory", async (params, { rejectWithValue }) => {
  try {
    return await chatHistoryApi(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const chatStream = createAsyncThunk("chat/chatStream", async (payload, { dispatch, rejectWithValue }) => {
  try {
    await chatStreamApi({
      payload,
      onChunk: (content) => {
        dispatch(appendBotMessage(content));
      },
      onError: (err) => {
        dispatch(setError(err));
      },
      onComplete: () => {
        dispatch(finalizeBotMessage());
      },
    });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    sessionId: "",
    currentBotMessage: "",
    prevConversation: {
      conversations: null,
      loading: false,
      error: null,
    },
    chatHistory: {
      chats: [],
      loading: false,
      error: null,
    },
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSession: (state, action) => {
      state.sessionId = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentBotMessage = "";
      state.error = null;
    },
    appendBotMessage: (state, action) => {
      state.currentBotMessage += action.payload;
    },
    finalizeBotMessage: (state) => {
      if (state.currentBotMessage.trim()) {
        state.messages.push({ type: "bot", llm_response: state.currentBotMessage });
        state.currentBotMessage = "";
      }
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // chat
      .addCase(chat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chat.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // append bot response
      })
      .addCase(chat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // conversation history
      .addCase(convHistory.pending, (state) => {
        state.prevConversation.loading = true;
        state.prevConversation.error = null;
      })
      .addCase(convHistory.fulfilled, (state, action) => {
        state.prevConversation.loading = false;
        state.prevConversation.conversations = action.payload;
      })
      .addCase(convHistory.rejected, (state, action) => {
        state.prevConversation.loading = false;
        state.prevConversation.error = action.payload;
      })

      // chat history
      .addCase(chatHistory.pending, (state) => {
        state.chatHistory.loading = true;
        state.chatHistory.error = null;
      })
      .addCase(chatHistory.fulfilled, (state, action) => {
        state.chatHistory.loading = false;
        state.chatHistory.chats = action.payload;
      })
      .addCase(chatHistory.rejected, (state, action) => {
        state.chatHistory.loading = false;
        state.chatHistory.error = action.payload;
      })

      .addCase(chatStream.pending, (state) => {
        state.loading = true;
        state.currentBotMessage = "";
        state.error = null;
      })
      .addCase(chatStream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch answer";
      });
  },
});

export const { addMessage, setSession, clearMessages, appendBotMessage, finalizeBotMessage, setError } = chatSlice.actions;
export default chatSlice.reducer;