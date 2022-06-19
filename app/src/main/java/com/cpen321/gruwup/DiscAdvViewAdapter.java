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
import java.util.Map;

public class DiscAdvViewAdapter extends RecyclerView.Adapter<DiscAdvViewAdapter.ViewHolder> {

    private static final String TAG = "DiscAdvViewAdapter";

    private ArrayList<Map<String, String>> mAdvNames = new ArrayList<>();
    private Context mContext;

    public DiscAdvViewAdapter(Context mContext, ArrayList<Map<String, String>> mAdvNames) {
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
        holder.adventureName.setText(mAdvNames.get(position).get("event"));
        holder.adventureTime.setText(mAdvNames.get(position).get("time"));
        holder.adventureLocation.setText(mAdvNames.get(position).get("location"));
        holder.adventureCount.setText(mAdvNames.get(position).get("count"));
        holder.adventureDescription.setText(mAdvNames.get(position).get("description"));
    }

    @Override
    public int getItemCount() {
        return mAdvNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView image;
        TextView adventureName;
        TextView adventureTime;
        TextView adventureLocation;
        TextView adventureCount;
        TextView adventureDescription;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            adventureName = itemView.findViewById(R.id.disc_adventure_name);
            adventureTime = itemView.findViewById(R.id.disc_adventure_time);
            adventureLocation = itemView.findViewById(R.id.disc_adventure_location);
            adventureCount = itemView.findViewById(R.id.disc_adventure_people_count);
            adventureDescription = itemView.findViewById(R.id.disc_adventure_description);
        }
    }
}
