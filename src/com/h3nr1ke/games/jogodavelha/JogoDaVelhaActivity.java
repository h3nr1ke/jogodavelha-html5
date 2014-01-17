package com.h3nr1ke.games.jogodavelha;

import net.margaritov.preference.colorpicker.ColorPickerPreference;
import android.R;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebSettings.RenderPriority;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

//public class JogoDaVelhaActivity extends DroidGap {
public class JogoDaVelhaActivity extends FragmentActivity implements
		SharedPreferences.OnSharedPreferenceChangeListener {
	// menu constants
	private static final int CONFIG = Menu.FIRST;
	private static final int SHARE = CONFIG + 1;
	private static final int ABOUT = SHARE + 1;

	// dialogs
	private static final int DIALOG_ABOUT = 0;

	private WebView webView;

	private Context c;

	private AdView adView;

	private JavaScriptInterface mJSI;

	public static ProgressDialog mDialog;

	// preferences
	public static final String SHARED_PREFS_NAME = "jv_settings";
	// Shared Preferences
	private SharedPreferences mPrefs;
	// constants for the prefs names
	private static final String X_COLOR = "x_color";
	private static final String O_COLOR = "o_color";
	private static final String GRID_COLOR = "grid_color";
	private static final String BG_COLOR = "bg_color";
	private static final String TXT_COLOR = "txt_color";

	// colors
	public String mXColor;
	public String mOColor;
	public String mGridColor;
	public String mBGColor;
	public String mTXTColor;

	public String mGameUrl = "file:///android_asset/www/jogo_velha.html";

	public void onSharedPreferenceChanged(SharedPreferences pSharedPrefs, String pKey) {
		updateColors();
	}

	private void updateColors() {
		mXColor = ColorPickerPreference.convertToARGB(mPrefs.getInt(X_COLOR,
				R.integer.COLOR_ORANGE));
		mOColor = ColorPickerPreference.convertToARGB(mPrefs.getInt(O_COLOR,
				R.integer.COLOR_PURPLE));
		mGridColor = ColorPickerPreference.convertToARGB(mPrefs.getInt(GRID_COLOR,
				R.integer.COLOR_BLUE));
		mBGColor = ColorPickerPreference.convertToARGB(mPrefs.getInt(BG_COLOR,
				R.integer.COLOR_BLACK));
		mTXTColor = ColorPickerPreference.convertToARGB(mPrefs.getInt(TXT_COLOR,
				R.integer.COLOR_WHITE));
		// Toast.makeText(this, mXColor, Toast.LENGTH_LONG).show();
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		c = this;

		setContentView(R.layout.main);

		// preferencies
		// get the system properties
		mPrefs = JogoDaVelhaActivity.this.getSharedPreferences(SHARED_PREFS_NAME, 0);
		mPrefs.registerOnSharedPreferenceChangeListener(this);
		onSharedPreferenceChanged(mPrefs, null);

		// loading dialog...
		mDialog = new ProgressDialog(this);
		mDialog.setCancelable(false);
		mDialog.setTitle(R.string.loading_tilte);
		mDialog.setMessage(getString(R.string.loading_message));

		// get the webview element
		webView = (WebView) findViewById(R.id.page_loader);

		// enable the javascript
		webView.getSettings().setJavaScriptEnabled(true);

		// enable zoom support and zoom controls
		webView.getSettings().setSupportZoom(false);
		webView.getSettings().setBuiltInZoomControls(false);

		// remove the scrollbars
		webView.setHorizontalScrollBarEnabled(false);
		webView.setVerticalScrollBarEnabled(false);

		// performance adjust
		webView.getSettings().setRenderPriority(RenderPriority.HIGH);
		webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

		// point to our mapa.html file
		webView.loadUrl(mGameUrl);
		// ponte entre javascript e javacode
		mJSI = new JavaScriptInterface(this);

		// updateColors
		updateColors();
		// define as cores no inicio
		mJSI.setColor(0, mXColor);
		mJSI.setColor(1, mOColor);
		mJSI.setColor(2, mGridColor);
		mJSI.setColor(3, mBGColor);
		mJSI.setColor(4, mTXTColor);
		webView.addJavascriptInterface(mJSI, "Android");

		// define our "browser"
		webView.setWebViewClient(new MapaWebClient());

		if (Constantes.ADD_AD) {
			// include the ad
			LinearLayout adContainer = (LinearLayout) findViewById(R.id.adViewLayout);
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

	}

	public void onDestroy() {
		// Destroy the AdView.
		if (Constantes.ADD_AD) {
			adView.destroy();
		}
		super.onDestroy();
	}

	// ----- Dialog control -----
	protected Dialog onCreateDialog(int id) {
		Dialog dialog;
		switch (id) {
		case DIALOG_ABOUT:
			dialog = new Dialog(c);

			// do some replaces
			String desc = getString(R.string.txt_desc);
			desc = desc.replace("@app_name@", getString(R.string.app_name));
			desc = desc.replace("@apps@",
					"<a href=\"market://search?q=pub:h3nr1ke\">h3nr1ke</a>");
			desc = desc.replace("\n", "<br />");

			String title = getString(R.string.txt_about_title);
			title = title.replace("@app_name@", getString(R.string.app_name));

			dialog.setContentView(R.layout.about_dialog);
			dialog.setTitle(title);

			TextView text = (TextView) dialog.findViewById(R.id.text);

			// there is a link in the text view
			text.setText(Html.fromHtml(desc));
			// include the clickable way
			text.setMovementMethod(LinkMovementMethod.getInstance());

			break;
		default:
			dialog = null;
		}
		return dialog;
	}

	// -------Create the menu-------
	@Override
	public boolean onCreateOptionsMenu(android.support.v4.view.Menu menu) {
		menu.add(0, CONFIG, 0, R.string.settings_title)
				.setIcon(android.R.drawable.ic_menu_preferences)
				.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
		menu.add(0, SHARE, 0, R.string.share).setIcon(android.R.drawable.ic_menu_share)
				.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
		menu.add(0, ABOUT, 0, R.string.about)
				.setIcon(android.R.drawable.ic_menu_info_details)
				.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);

		return super.onCreateOptionsMenu(menu);
	}

	// handle the menu buttons
	public boolean onOptionsItemSelected(android.support.v4.view.MenuItem item) {
		Intent i = null;

		switch (item.getItemId()) {
		case CONFIG:
			startActivityForResult(new Intent(this, Settings.class), 1);
			// this.startActivity(new Intent(this, Settings.class));
			return true;
		case SHARE:
			i = new Intent(Intent.ACTION_SEND);
			i.setType("text/plain");
			i.putExtra(Intent.EXTRA_TEXT, getString(R.string.share_msg));

			try {
				startActivity(Intent.createChooser(i, getString(R.string.share_title)));
			} catch (android.content.ActivityNotFoundException ex) {
				// (handle error)
			}
			return true;

		case ABOUT:
			this.showDialog(DIALOG_ABOUT);
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	// ------- end of menu creation --------

	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == 1) {
			// Toast.makeText(this,mGameUrl+"?t="+System.currentTimeMillis(),Toast.LENGTH_LONG).show();
			// webView.loadUrl(mGameUrl+"?t="+System.currentTimeMillis());
			// webView.loadUrl( "javascript:window.location.reload( true )" );
			mJSI.setColor(0, mXColor);
			mJSI.setColor(1, mOColor);
			mJSI.setColor(2, mGridColor);
			mJSI.setColor(3, mBGColor);
			mJSI.setColor(4, mTXTColor);
			// executando fucoes javascript a partir do java...
			webView.loadUrl("javascript:updateColors();updateActual();");
		}
	}

	class MapaWebClient extends WebViewClient {
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			view.loadUrl(url);
			return true;
		}

		@Override
		public void onLoadResource(WebView view, String url) {
			// TODO Auto-generated method stub
			super.onLoadResource(view, url);
			mDialog.show();
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			// TODO Auto-generated method stub
			super.onPageFinished(view, url);
			mDialog.dismiss();
		}
	}

}
