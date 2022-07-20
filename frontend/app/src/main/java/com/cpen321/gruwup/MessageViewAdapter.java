package com.cpen321.gruwup;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class MessageViewAdapter extends RecyclerView.Adapter<MessageViewAdapter.ViewHolder> {

    Context context;
    ArrayList<Message> messages;
    private static final String SENT_MESSAGE = "sent";
    private static final String RECEIVED_MESSAGE = "received";

    public MessageViewAdapter(Context context, ArrayList<Message> messages) {
        this.context = context;
        this.messages = messages;
    }

    @NonNull
    @Override
    public MessageViewAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.message_list, parent, false);
        return new MessageViewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MessageViewAdapter.ViewHolder holder, int position) {
        Message message = messages.get(holder.getAdapterPosition());
        if (messages.get(holder.getAdapterPosition()).getMessageStatus().equals(SENT_MESSAGE)) {
            holder.sentMessage.setText(message.getMessage());
            holder.sentMessage.setVisibility(View.VISIBLE);
        } else if (messages.get(holder.getAdapterPosition()).getMessageStatus().equals(RECEIVED_MESSAGE)) {
            holder.receiverName.setText(message.getName());
            holder.receiverName.setVisibility(View.VISIBLE);
            holder.receivedMessage.setText(message.getMessage());
            holder.receivedMessage.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView sentMessage;
        TextView receivedMessage;
        TextView senderName;
        TextView receiverName;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            sentMessage = itemView.findViewById(R.id.sent_message);
            receivedMessage = itemView.findViewById(R.id.received_message);
            senderName = itemView.findViewById(R.id.sender_name);
            receiverName = itemView.findViewById(R.id.receiver_name);
        }
    }
}
