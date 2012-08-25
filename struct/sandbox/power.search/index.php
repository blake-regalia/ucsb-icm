<html>

<script type="text/javascript" src="../../js/.jquery.js"></script>
<?php $DEBUG=TRUE; $PATH="../../js"; chdir('../../js'); require "compile.php"; ?>
<link rel="stylesheet" href="../../css/power.css" type="text/css"/>
<body>

<div class="power-search">
	<div class="power-search-title">Advanced Search</div>
	<div class="power-search-content">
		<div class="power-search-form">
			<table style="width:40%;">
				<tr>
					<td><input type="checkbox" />Department:</td>
					<td>
						<select>
							<option value="">---</option>
							<option value="ANTH">ANTH</option>
							<option value="ART">ART</option>
							<option value="CMPSC">CMSPC</option>
						</select>
					</td>
				</tr>
			</table>
		</div>
	</div>
</div>


<div class="widget-menu">
	<div class="widget-menu-pane">
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.directions.gif');">
			<span class="widget-menu-icon-hover">directions</span>
		</div>
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.courses.gif');">
			<span class="widget-menu-icon-hover">courses</span>
		</div>
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.bus.routes.jpg');">
			<span class="widget-menu-icon-hover">bus routes</span>
		</div>
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.parking.jpg');">
			<span class="widget-menu-icon-hover">parking</span>
		</div>
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.eateries.jpg');">
			<span class="widget-menu-icon-hover">eateries</span>
		</div>
		<div class="widget-menu-icon" style="background-image:url('../../resource/widget.icon.environment.jpg');">
			<span class="widget-menu-icon-hover">environment</span>
		</div>
	</div>
</div>

</body>
</html>