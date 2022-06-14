package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.content.Context;
import android.media.Image;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

public class CategoryViewAdapter extends RecyclerView.Adapter<CategoryViewAdapter.ViewHolder> {

    private static final String TAG = "CategoryViewAdapter";

    //vars
    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private Context mContext;

    public CategoryViewAdapter(Context mContext ,ArrayList<String> mCategoryNames) {
        this.mCategoryNames = mCategoryNames;
        this.mContext = mContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // To do: Same for create profile // here is done for edit profile
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.category_list, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
//        Glide.with(mContext)
//                .asBitmap()
//                .load(mCategoryImages.get(position))
//                .into(holder.image);

        holder.categoryName.setText(mCategoryNames.get(position));
        holder.categoryName.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View view) {
                Log.d(TAG, "onClick: clcked on an image: "+ mCategoryNames.get(position));
                Toast.makeText(mContext, mCategoryNames.get(position),Toast.LENGTH_SHORT).show();
            }
        });
//        holder.image.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Log.d(TAG, "onClick: clcked on an image: "+ mCategoryNames.get(position));
//                Toast.makeText(mContext, mCategoryNames.get(position),Toast.LENGTH_SHORT).show();
//            }
//        });

    }

    @Override
    public int getItemCount() {
        return mCategoryNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        ImageView image;
        TextView categoryName;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);
//            image = itemView.findViewById(R.id.category_image);
            categoryName = itemView.findViewById(R.id.categoryName);
        }
    }
}
