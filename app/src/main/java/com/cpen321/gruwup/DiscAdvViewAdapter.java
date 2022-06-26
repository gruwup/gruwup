package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.media.Image;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Map;

public class DiscAdvViewAdapter extends RecyclerView.Adapter<DiscAdvViewAdapter.ViewHolder> {

    private static final String TAG = "DiscAdvViewAdapter";
    Dialog profileDialog;
    private ArrayList<Map<String, String>> mAdvNames = new ArrayList<>();
    private Context mContext;

    public DiscAdvViewAdapter(Context mContext, ArrayList<Map<String, String>> mAdvNames) {
        profileDialog = new Dialog(mContext);
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
        holder.adventureImage.setImageBitmap(DiscoverFragment.B64ToBmp(mAdvNames.get(position).get("image")));
        holder.adventureCard.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Clicked Adventure Card");
                showPopUp(view, position);
            }
        });
    }

    private void showPopUp(View view, int position) {
        Button requestToJoin;
        TextView cancel;
        TextView eventType;
        TextView memberCount;
        TextView time;
        TextView location;
        Button viewInMap;

        profileDialog.setContentView(R.layout.view_adventure_pop_up);
        profileDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        cancel = (TextView) profileDialog.findViewById(R.id.cancel_view_adventure);
        eventType = (TextView) profileDialog.findViewById(R.id.view_adventure_event_type);
        memberCount = (TextView) profileDialog.findViewById(R.id.view_adventure_member_count);
        time = (TextView) profileDialog.findViewById(R.id.view_adventure_time);
        location = (TextView) profileDialog.findViewById(R.id.view_adventure_location);
        requestToJoin = (Button) profileDialog.findViewById(R.id.request_join_adventure);
        viewInMap = (Button) profileDialog.findViewById(R.id.adventure_open_in_maps);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                profileDialog.dismiss();
            }
        });
        //set the contents of the popup

        eventType.setText(mAdvNames.get(position).get("event"));
        memberCount.setText(mAdvNames.get(position).get("count"));
        time.setText(mAdvNames.get(position).get("time"));
        location.setText(mAdvNames.get(position).get("location"));

        viewInMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AppCompatActivity activity = (AppCompatActivity) unwrap(view.getContext());
                Fragment mvf = new MapViewFragment();
                activity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, mvf).addToBackStack(null).commit();
                profileDialog.dismiss();
            }
        });
        profileDialog.show();
    }

    @Override
    public int getItemCount() {
        return mAdvNames == null ? 0 : mAdvNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView image;
        TextView adventureName;
        TextView adventureTime;
        TextView adventureLocation;
        TextView adventureCount;
        TextView adventureDescription;
        CardView adventureCard;
        ImageView adventureImage;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            adventureName = itemView.findViewById(R.id.disc_adventure_name);
            adventureTime = itemView.findViewById(R.id.disc_adventure_time);
            adventureLocation = itemView.findViewById(R.id.disc_adventure_location);
            adventureCount = itemView.findViewById(R.id.disc_adventure_people_count);
            adventureDescription = itemView.findViewById(R.id.disc_adventure_description);
            adventureCard = itemView.findViewById(R.id.adventure_card);
            adventureImage = itemView.findViewById(R.id.disc_adventure_image);
        }
    }

    private static Activity unwrap(Context context) {
        while (!(context instanceof Activity) && context instanceof ContextWrapper) {
            context = ((ContextWrapper) context).getBaseContext();
        }

        return (Activity) context;
    }
}
