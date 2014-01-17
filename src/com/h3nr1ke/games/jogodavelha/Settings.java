package com.h3nr1ke.games.jogodavelha;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

public class Settings extends PreferenceActivity implements
		SharedPreferences.OnSharedPreferenceChangeListener {

	private AdView adView;

	@Override
	protected void onCreate(Bundle icicle) {
		super.onCreate(icicle);
		setContentView(R.layout.adlayout); // set the contentview. On the
											// layout, you need a listview with
											// the id: @android:id/list

		if (Constantes.ADD_AD) {
			// include the ad
			LinearLayout adContainer = (LinearLayout) findViewById(R.id.ad_view);
			// Create the adView
			adView = new AdView(this, AdSize.BANNER, Constantes.AD_ID);

			// include the ad inside a linear layout in the main.xml
			adContainer.addView(adView);

			// create the ad request conf
			AdRequest request = new AdRequest();
			if (Constantes.AD_TEST) {
				for (String td : Constantes.AD_TEST_DEVICE) {
					request.addTestDevice(td);
				}

				request.setTesting(true);
			}

			// load the ad
			adView.loadAd(request);
		}

		addPreferencesFromResource(R.xml.settings);

		// populatePreferencesDesc();

		getPreferenceManager().getSharedPreferences()
				.registerOnSharedPreferenceChangeListener(this);
		getPreferenceManager().setSharedPreferencesName(
				JogoDaVelhaActivity.SHARED_PREFS_NAME);

	}

	public void tst(String str) {
		Toast.makeText(Settings.this, str, Toast.LENGTH_LONG).show();
	}

	@Override
	protected void onResume() {
		super.onResume();
		// populatePreferencesDesc();
		// Set up a listener whenever a key changes
		getPreferenceScreen().getSharedPreferences()
				.registerOnSharedPreferenceChangeListener(this);
	}

	@Override
	protected void onDestroy() {
		getPreferenceManager().getSharedPreferences()
				.unregisterOnSharedPreferenceChangeListener(this);
		super.onDestroy();
	}

	// @Override
	public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
	}

}
