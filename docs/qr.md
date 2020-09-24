<h2 style="font-weight:300; font-size:1.5rem; text-align: center;">
  Create integration with QR Codes
</h2>
<p align="center">
  <video controls="" src="https://s3-ap-southeast-2.amazonaws.com/assets.alpacamaps.com/assets/alpaca/videos/qr-palooza-no-sound-1080p.mp4" poster="https://s3-ap-southeast-2.amazonaws.com/assets.alpacamaps.com/assets/alpaca/videos/Campaigns_integration-holder.jpg" width="800" height="450"></video>
</p>

The Alpaca Travel platform makes it easy to pick up content from the real-world
through QR codes.

 * No installation necessary
 * Displays the mobile view (supporting enterprise customisations and domain masking)
 * Easy to generate

## QR Endpoints

Alpaca offers end-points that you can generate QR codes directly from.

Using either the SVG or PNG URL's, you can create direct QR codes to the
URL's of your choice.

```html
<p>SVG Generation</p>
<img src="https://discover.alpacamaps.com/api/qr?q=URL" alt="SVG QR Code"/>

<p>PNG Generation<p>
<img src="https://discover.alpacamaps.com/api/qr2.svg?light=ffffffff&dark=333333ff&text=URL" alt="PNG QR Code"/>
```

?> Please note; these QR codes do not have QR tracking included. It is
recommended that you add UTM Tracking Codes or a URL from a click tracking
service in order to obtain detailed impressions.
