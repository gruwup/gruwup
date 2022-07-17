package com.cpen321.gruwup;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.media.Image;
import android.os.Bundle;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class DiscAdvViewAdapter extends RecyclerView.Adapter<DiscAdvViewAdapter.ViewHolder> {

    private static final String TAG = "DiscAdvViewAdapter";
    Dialog viewAdventureDialog;
    private ArrayList<Map<String, String>> mAdvNames = new ArrayList<>();
    private Context mContext;
    private String address;

    public DiscAdvViewAdapter(Context mContext, ArrayList<Map<String, String>> mAdvNames) {
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
        holder.adventureCard.setOnClickListener(new View.OnClickListener() {
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
        TextView title;
        TextView eventType;
        TextView memberCount;
        TextView time;
        TextView location;
        TextView description;
        Button viewInMap;
        String id;

        viewAdventureDialog.setContentView(R.layout.view_adventure_pop_up);
        viewAdventureDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        cancel = (TextView) viewAdventureDialog.findViewById(R.id.cancel_view_adventure);
        title = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_event_title);
        eventType = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_event_type);
        memberCount = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_member_count);
        time = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_time);
        location = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_location);
        description = (TextView) viewAdventureDialog.findViewById(R.id.view_adventure_description);
        requestToJoin = (Button) viewAdventureDialog.findViewById(R.id.request_join_adventure);
        viewInMap = (Button) viewAdventureDialog.findViewById(R.id.adventure_open_in_maps);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewAdventureDialog.dismiss();
            }
        });
        id = mAdvNames.get(position).get("id");
        // Set the contents of the popup

        title.setText(mAdvNames.get(position).get("title"));
        eventType.setText(mAdvNames.get(position).get("event"));
        memberCount.setText(mAdvNames.get(position).get("count"));
        time.setText(mAdvNames.get(position).get("time"));
        location.setText(mAdvNames.get(position).get("location"));
        description.setText(mAdvNames.get(position).get("description"));

        viewInMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AppCompatActivity activity = (AppCompatActivity) unwrap(view.getContext());
                Fragment mvf = new MapViewFragment();
                Bundle locationArgs = new Bundle();
                locationArgs.putString("address", mAdvNames.get(position).get("location"));
                mvf.setArguments(locationArgs);
                activity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, mvf).addToBackStack(null).commit();
                viewAdventureDialog.dismiss();
            }
        });

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userName", SupportSharedPreferences.getUserName(mContext));
            jsonObject.put("userId", SupportSharedPreferences.getUserId(mContext));
            jsonObject.put("dateTime", Long.valueOf(System.currentTimeMillis()));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        requestToJoin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(mContext, "Request sent!", Toast.LENGTH_SHORT).show();
                String cookie = SupportSharedPreferences.getCookie(mContext);
                SupportRequests.postWithCookie("http://" + address + ":8081/user/request/" + id + "/send-request", jsonObject.toString(), cookie, new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful()) {
                            String responseData = response.body().string();
                            Log.d(TAG, "Response: " + responseData);
                        } else {
                            System.out.println("HTTP req failed");
                        }
                    }
                });
                viewAdventureDialog.dismiss();
            }
        });

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
        while (!(context instanceof Activity) && context instanceof ContextWrapper) {
            context = ((ContextWrapper) context).getBaseContext();
        }
        return (Activity) context;
    }

}
