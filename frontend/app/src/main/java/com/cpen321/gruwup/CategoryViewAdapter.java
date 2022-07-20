package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;


import java.util.ArrayList;

public class CategoryViewAdapter extends RecyclerView.Adapter<CategoryViewAdapter.ViewHolder> {

    private static final String TAG = "CategoryViewAdapter";

    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private final Context mContext;
    boolean isSelectMode = false;
    private final ArrayList<Integer> mSelectedCategories = new ArrayList<>();

    public CategoryViewAdapter(Context mContext, ArrayList<String> mCategoryNames) {
        this.mCategoryNames = mCategoryNames;
        this.mContext = mContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.category_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") final int position) {

        holder.categoryName.setText(mCategoryNames.get(position));
        holder.categoryName.setTextColor(Color.parseColor("#766867"));
        holder.categoryName.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Log.d(TAG, "onClick: clicked on an item: " + mCategoryNames.get(position));
                Toast.makeText(mContext, mCategoryNames.get(position), Toast.LENGTH_SHORT).show();

                isSelectMode = true;
                if (mSelectedCategories.contains(position)) {
                    holder.categoryName.setTextColor(Color.parseColor("#766867"));
                    mSelectedCategories.remove(Integer.valueOf(position));
                    Log.d(TAG, "Selected items after remove are " + mSelectedCategories);
                } else {
                    holder.categoryName.setTextColor(Color.parseColor("#ffffff"));
                    mSelectedCategories.add(position);

                    Log.d(TAG, "Selected items after add are " + mSelectedCategories);
                }

                if (mSelectedCategories.size() == 0) {
                    isSelectMode = false;
                }

            }
        });
    }

    @Override
    public int getItemCount() {
        return mCategoryNames.size();
    }

    public int getSelectedCategoriesCount() {
        return mSelectedCategories.size();
    }

    public ArrayList<Integer> getSelectedCategories() {
        return mSelectedCategories;
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView categoryName;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            categoryName = itemView.findViewById(R.id.categoryName);
        }
    }
}

