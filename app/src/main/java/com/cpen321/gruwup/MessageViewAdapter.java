package com.cpen321.gruwup;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class MessageViewAdapter extends RecyclerView.Adapter<MessageViewAdapter.ViewHolder>{

    Context context;
    ArrayList<Message> messages;
    static final String TAG = "ChatViewAdapter";

    public MessageViewAdapter(Context context, ArrayList<Message> messages){
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
        Message message = messages.get(position);

        holder.sentMessage.setText(message.getMessage());
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView sentMessage;
        TextView receivedMessage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            sentMessage = itemView.findViewById(R.id.sent_message);
            receivedMessage = itemView.findViewById(R.id.received_message);

        }
    }
}
