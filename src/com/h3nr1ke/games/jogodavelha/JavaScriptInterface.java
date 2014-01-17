package com.h3nr1ke.games.jogodavelha;

import java.util.Random;

import android.content.Context;
import android.widget.Toast;

public class JavaScriptInterface {
	private Context mContext;
	private String mXColor = String.valueOf(R.integer.COLOR_ORANGE);
	private String mOColor =  String.valueOf(R.integer.COLOR_PURPLE);
	private String mGridColor =  String.valueOf(R.integer.COLOR_BLUE);
	private String mBGColor =  String.valueOf(R.integer.COLOR_BLACK);
	private String mTXTColor =  String.valueOf(R.integer.COLOR_WHITE);
	private Random randomGenerator = new Random();

	/** Instantiate the interface and set the context */
	JavaScriptInterface(Context c) {
		mContext = c;
	}

	/** Show a toast from the web page */
	public void showToast(String toast) {
		Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
	}

	/**
	 * devolge um numero randomico ate o limite passado
	 * */
	public int getRandom(int pLimit) {
		return randomGenerator.nextInt(pLimit);
	}

	/**
	 * return the color of one item
	 * */
	public String getColor(int item) {
		String ret = "";
		switch (item) {
		case 0: // x
			ret = mXColor;
			break;
		case 1: // o
			ret = mOColor;
			break;
		case 2: // grid
			ret = mGridColor;
			break;
		case 3: // background
			ret = mBGColor;
			break;
		case 4: // text
			ret = mTXTColor;
			break;
		}
		return ret;
	}

	/**
	 * set the color of one item
	 * */
	public void setColor(int pitem, String pColor) {
		switch (pitem) {
		case 0: // x
			mXColor = pColor;
			break;
		case 1: // o
			mOColor = pColor;
			break;
		case 2: // grid
			mGridColor = pColor;
			break;
		case 3: // background
			mBGColor = pColor;
			break;
		case 4: // grid
			mTXTColor = pColor;
			break;
		default:
			break;
		}
	}

	/**
	 * Return the translated string
	 */
	public String getTransString(String str) {
		String ret;
		int resID = mContext.getResources().getIdentifier(str, "string",
				mContext.getPackageName());
		ret = mContext.getString(resID);
		return ret;
	}

}
