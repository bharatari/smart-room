/* global Windows */
/**
 * If this application runs as a packaged web app on Windows,
 * this app utilizes native Windows notifications.
 */
export default {
	notify(body) {
		if(Windows !== 'undefined' && Windows.UI !== 'undefined' && Windows.UI.Notifications !== 'undefined') {
			var notifications = Windows.UI.Notifications;
			//Get the XML template where the notification content will be suplied
			var template = notifications.ToastTemplateType.toastImageAndText01;
			var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
			//Supply the text to the XML content
			var toastTextElements = toastXml.getElementsByTagName("text");
			toastTextElements[0].appendChild(toastXml.createTextNode(body));
			//Supply an image for the notification
			var toastImageElements = toastXml.getElementsByTagName("image");
			//Set the image this could be the background of the note, get the image from the web
			toastImageElements[0].setAttribute("src", "https://raw.githubusercontent.com/seksenov/grouppost/master/images/logo.png");
			toastImageElements[0].setAttribute("alt", "red graphic");
			//Specify a long duration
			var toastNode = toastXml.selectSingleNode("/toast");
			toastNode.setAttribute("duration", "long");
			//Specify the audio for the toast notification                     
			var audio = toastXml.createElement("audio");
			audio.setAttribute("src", "ms-winsoundevent:Notification.IM");
			//Create a toast notification based on the specified XML
			var toast = new notifications.ToastNotification(toastXml);
			//Send the toast notification
			var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
			toastNotifier.show(toast);
		}
	}
}
