package com.cpen321.gruwup;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ChatViewAdapter extends RecyclerView.Adapter<ChatViewAdapter.ViewHolder>{

    Context context;
    ArrayList <User> users;
    static final String TAG = "ChatViewAdapter";

    public ChatViewAdapter(Context context, ArrayList<User> users){
        this.context = context;
        this.users = users;

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.user_chat_list, parent, false);
        return new ChatViewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        User user = users.get(position);

        holder.userName.setText(user.getName());
        // To do: change this to profile pic of individual users
        holder.img.setImageResource(R.drawable.college_student);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, ChatActivity.class);
                // To do: Can pass in user information, such as their name and id here
                // or the adventure group name
                intent.putExtra("name", user.getName());
                intent.putExtra("userId", user.getUserId());
                context.startActivity(intent);
            }
        });

    }

    @Override
    public int getItemCount() {
        return users.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView userName;
        TextView lastMessage;
        TextView messageTime;
        ImageView img;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            userName = itemView.findViewById(R.id.user);
            lastMessage = itemView.findViewById(R.id.lastMessage);
            messageTime = itemView.findViewById(R.id.messageTime);
            img = itemView.findViewById(R.id.userProfileImg);
        }
    }
}