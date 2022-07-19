package com.cpen321.gruwup;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

//import androidx.test.espresso.contrib.RecyclerViewActions; //doesn't work for some reason

import static org.hamcrest.Matchers.allOf;
import static org.junit.Assert.assertTrue;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class RequestTest {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void requestFromDiscover() {
        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
        onView(withId(R.id.discoveredAdventures)).check(matches(isDisplayed()));
        ViewInteraction cardView = onView(
                allOf(withId(R.id.adventure_card),
                        this.childAtPosition(
                                this.childAtPosition(
                                        withId(R.id.discoveredAdventures),
                                        0),
                                0),
                        isDisplayed()));
        cardView.perform(click());
        onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed())).perform(click());
        boolean isDismissed = false;
        try {
            onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed()));
        }
        catch (Exception e) {
            isDismissed = true;
        }
        finally {
            assertTrue(isDismissed);
        }
    }

    @Test
    public void requestFromSearch() { //checks that Search Fragment can be opened from navbar
        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
        onView((withId(R.id.nav_search))).check(matches(isDisplayed())).perform(click());
        onView(withText("Search Results")).check(matches(isDisplayed()));
        ViewInteraction cardView = onView(
                allOf(withId(R.id.adventure_card),
                        this.childAtPosition(
                                this.childAtPosition(
                                        withId(R.id.searchedAdventures),
                                        0),
                                0),
                        isDisplayed()));
        cardView.perform(click());
        onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed())).perform(click());
        boolean isDismissed = false;
        try {
            onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed()));
        }
        catch (Exception e) {
            isDismissed = true;
        }
        finally {
            assertTrue(isDismissed);
        }
    }

    static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}

