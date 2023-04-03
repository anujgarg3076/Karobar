<%@ page contentType="text/html;charset=UTF-8" language="Java"
import="com.tieto.cs.HTMLTools.CSModule"
import="com.tieto.cs.stock.StockRights"
import="org.apache.log4j.Logger"
%>
<%
    Logger log = Logger.getLogger(this.getClass());
    StockRights rights = new StockRights(session);
    if (!rights.applicationAllowed()) {
        log.error("No rights to use application!");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminal Stock Application</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="../../servlet/JavaScriptServlet"></script>
    <script src="./bundle.js"></script>
  </body>
</html>
