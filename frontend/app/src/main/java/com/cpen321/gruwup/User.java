package com.cpen321.gruwup;


public class User {

    private String userId;
    private String name;
    private String profilePic;
    private String biography;
    private String categories;

    public User() {
    }

    public User(String userId, String name, String profilePic, String biography, String categories) {
        this.userId = userId;
        this.name = name;
        this.profilePic = profilePic;
        this.biography = biography;
        this.categories = categories;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }
}
