package com.cpen321.gruwup;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class RequestViewAdapter extends RecyclerView.Adapter<RequestViewAdapter.ViewHolder> {

    Context context;
    ArrayList<Request> requests;
    static final String TAG = "RequestViewAdapter";

    public RequestViewAdapter(Context context, ArrayList<Request> requests){
        this.context = context;
        this.requests = requests;

    }
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.request_list, parent, false);
        return new RequestViewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Request request = requests.get(position);

        // To do: change user to requester
        holder.requesterName.setText(request.getRequesterName());


    }

    @Override
    public int getItemCount() {
        return requests.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView requesterName;
        TextView adventureName;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            requesterName = itemView.findViewById(R.id.requesterName);
            adventureName = itemView.findViewById(R.id.adventureName);

        }
    }
}
