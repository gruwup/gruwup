package com.cpen321.gruwup;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

//import androidx.test.espresso.contrib.RecyclerViewActions; //doesn't work for some reason

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.any;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertTrue;

import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.annotation.CheckResult;
import androidx.test.espresso.AmbiguousViewMatcherException;
import androidx.test.espresso.NoMatchingRootException;
import androidx.test.espresso.NoMatchingViewException;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
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
    public ActivityScenarioRule<LogInActivity> activityRule =
            new ActivityScenarioRule<>(LogInActivity.class);

    @CheckResult
    public static boolean exists(ViewInteraction interaction) {
        try {
            interaction.perform(new ViewAction() {
                @Override public Matcher<View> getConstraints() {
                    return any(View.class);
                }
                @Override public String getDescription() {
                    return "check for existence";
                }
                @Override
                public void perform(UiController uiController, View view) {
                    // no op, if this is run, then the execution will continue after .perform(...)
                }
            });
            return true;
        } catch (AmbiguousViewMatcherException ex) {
            // if there's any interaction later with the same matcher, that'll fail anyway
            return true; // we found more than one
        } catch (NoMatchingViewException ex) {
            return false;
        } catch (NoMatchingRootException ex) {
            // optional depending on what you think "exists" means
            return false;
        }
    }

    @Test
    public void requestFromDiscover() {
        ViewInteraction hj = onView(
                allOf(withText("Sign in"),
                        childAtPosition(
                                allOf(withId(R.id.sign_in_button),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                0)),
                                0),
                        isDisplayed()));

        if (exists(hj)){
            hj.perform(click());
        }

        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
        SystemClock.sleep(2500);
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
//
//    @Test
//    public void requestFromSearch() { //checks that Search Fragment can be opened from navbar
//        ViewInteraction hj = onView(
//                allOf(withText("Sign in"),
//                        childAtPosition(
//                                allOf(withId(R.id.sign_in_button),
//                                        childAtPosition(
//                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
//                                                0)),
//                                0),
//                        isDisplayed()));
//
//        if (exists(hj)){
//            hj.perform(click());
//        }
//
//        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
//        onView((withId(R.id.nav_search))).check(matches(isDisplayed())).perform(click());
//        onView(withText("Search Results")).check(matches(isDisplayed()));
//        SystemClock.sleep(2500);
//        ViewInteraction cardView = onView(
//                allOf(withId(R.id.adventure_card),
//                        this.childAtPosition(
//                                this.childAtPosition(
//                                        withId(R.id.searchedAdventures),
//                                        0),
//                                0),
//                        isDisplayed()));
//        cardView.perform(click());
//        onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed())).perform(click());
//        boolean isDismissed = false;
//        try {
//            onView(withId(R.id.request_join_adventure)).check(matches(isDisplayed()));
//        }
//        catch (Exception e) {
//            isDismissed = true;
//        }
//        finally {
//            assertTrue(isDismissed);
//        }
//    }

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

