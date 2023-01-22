package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

    public class AdventureInfoAdapter extends RecyclerView.Adapter<AdventureInfoAdapter.ViewHolder> {
    private static final String TAG = "AdventureInfoAdapter";

    Dialog viewAdventureDialog;
    private ArrayList<Map<String, String>> mAdvNames = new ArrayList<>();
    private Context mContext;
    String address;

    public AdventureInfoAdapter(Context mContext, ArrayList<Map<String, String>> mAdvNames) {
        if (mContext==null){
            return;
        }
        address = mContext.getResources().getString(R.string.connection_address);
        viewAdventureDialog = new Dialog(mContext);
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
        holder.adventureName.setText("Event: " + mAdvNames.get(position).get("event"));
        holder.adventureTitle.setText("Title: " + mAdvNames.get(position).get("title"));
        holder.adventureTime.setText("Time: " + mAdvNames.get(position).get("time"));
        holder.adventureLocation.setText(mAdvNames.get(position).get("location"));
        holder.adventureCount.setText("Person count: " + mAdvNames.get(position).get("count"));
        holder.adventureDescription.setText("Description: " + mAdvNames.get(position).get("description"));
        holder.adventureImage.setImageBitmap(DiscoverFragment.B64ToBmp(mAdvNames.get(position).get("image")));
//        holder.adventureCard.Wid
        holder.adventureCard.getLayoutParams().width = 650;
        holder.adventureCard.getLayoutParams().height = 900;

        holder.adventureCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Clicked Adventure Card");
                showPopUp(position);
            }
        });
        setAnimation(holder.itemView, position);
    }

    private void setAnimation(View itemView, int i) {
        if (i >= 0) {
            Animation animation = AnimationUtils.loadAnimation(itemView.getContext(), android.R.anim.slide_in_left);
            itemView.startAnimation(animation);
        }
    }

    private void showPopUp(int position) {
        TextView cancel;
        TextView title;
        TextView eventType;
        TextView memberCount;
        TextView time;
        TextView location;
        TextView description;

        viewAdventureDialog.setContentView(R.layout.adventure_info_pop_up);
        viewAdventureDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        cancel = (TextView) viewAdventureDialog.findViewById(R.id.cancel_view_adventure);
        title = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_event_title);
        eventType = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_event_type);
        memberCount = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_member_count);
        time = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_time);
        location = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_location);
        description = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_description);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewAdventureDialog.dismiss();
            }
        });

        // Set the contents of the popup

        title.setText(mAdvNames.get(position).get("title"));
        eventType.setText(mAdvNames.get(position).get("event"));
        memberCount.setText(mAdvNames.get(position).get("count"));
        time.setText(mAdvNames.get(position).get("time"));
        location.setText(mAdvNames.get(position).get("location"));
        description.setText(mAdvNames.get(position).get("description"));

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userName", SharedPreferencesUtil.getUserName(mContext));
            jsonObject.put("userId", SharedPreferencesUtil.getUserId(mContext));
            jsonObject.put("dateTime", Long.valueOf(System.currentTimeMillis()));
        } catch (JSONException e) {
            e.printStackTrace();
        }


        viewAdventureDialog.show();
    }

    @Override
    public int getItemCount() {
        return mAdvNames == null ? 0 : mAdvNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView adventureName;
        TextView adventureTime;
        TextView adventureLocation;
        TextView adventureCount;
        TextView adventureTitle;
        TextView adventureDescription;
        CardView adventureCard;
        ImageView adventureImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            adventureName = itemView.findViewById(R.id.disc_adventure_name);
            adventureTitle = itemView.findViewById(R.id.disc_adventure_title);
            adventureTime = itemView.findViewById(R.id.disc_adventure_time);
            adventureLocation = itemView.findViewById(R.id.disc_adventure_location);
            adventureCount = itemView.findViewById(R.id.disc_adventure_people_count);
            adventureDescription = itemView.findViewById(R.id.disc_adventure_description);
            adventureCard = itemView.findViewById(R.id.adventure_card);
            adventureImage = itemView.findViewById(R.id.disc_adventure_image);
        }
    }

    public static Activity unwrap(Context context) {
        Context currentContext = context;
        while (currentContext instanceof ContextWrapper && !(currentContext instanceof Activity)) {
            currentContext = ((ContextWrapper) currentContext).getBaseContext();
        }
        return (Activity) currentContext;
    }

}
