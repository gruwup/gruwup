package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class DiscAdvViewAdapter extends RecyclerView.Adapter<DiscAdvViewAdapter.ViewHolder> {

    private static final String TAG = "DiscAdvViewAdapter";

    private ArrayList<String> mAdvNames = new ArrayList<>();
    private Context mContext;

    public DiscAdvViewAdapter(Context mContext , ArrayList<String> mAdvNames) {
        this.mAdvNames = mAdvNames;
        this.mContext = mContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.discover_adventure_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
        holder.adventureName.setText(mAdvNames.get(position));
    }

    @Override
    public int getItemCount() {
        return mAdvNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView image;
        TextView adventureName;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            adventureName = itemView.findViewById(R.id.disc_adventure_name);
        }
    }
}
