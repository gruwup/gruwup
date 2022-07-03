package com.cpen321.gruwup;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Paint;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.util.Log;
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
    Dialog requestDialog;
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
        holder.adventureName.setText(request.getAdventureName());
        holder.adventureTitle.setText(request.getAdventureName());

        requestDialog = new Dialog(this.context);
        holder.acceptRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // if backend request is successful
                showPopUp(view, "accept");
                // To do: remove item from recycler view upon click
//                requests.remove(position);
            }
        });

        holder.denyRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // if backend request is successful
                showPopUp(view, "deny");
                // To do: remove item from recycler view upon click
//                requests.remove(position);
            }
        });

        holder.requesterName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "clicked on requester name");
            }
        });




    }

    private void showPopUp(View view, String action) {
        if (action=="accept"){
            requestDialog.setContentView(R.layout.accept_request_pop_up);
            requestDialog.show();

        }
        else if (action=="deny"){
            requestDialog.setContentView(R.layout.deny_request_pop_up);
            requestDialog.show();
        }

    }

    @Override
    public int getItemCount() {
        return requests.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView requesterName;
        TextView adventureName;
        TextView adventureTitle;
        TextView acceptRequest;
        TextView denyRequest;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            requesterName = itemView.findViewById(R.id.requesterName);
            adventureName = itemView.findViewById(R.id.requestAdventureName);
            adventureTitle = itemView.findViewById(R.id.adventureName);
            acceptRequest = itemView.findViewById(R.id.acceptRequest);
            denyRequest = itemView.findViewById(R.id.denyRequest);

            requesterName.setPaintFlags(requesterName.getPaintFlags() |   Paint.UNDERLINE_TEXT_FLAG);
        }
    }
}
