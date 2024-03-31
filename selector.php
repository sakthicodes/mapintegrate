<?php include 'dbConnect.php'; ?>
<script src="https://code.jquery.com/jquery-3.7.0.js" integrity="sha256-JlqSTELeR4TLqP0OG9dxM7yDPqX1ox/HfgiSLBj8+kM=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
<style>
  
</style>
<!-- Modal -->
<div class="modal" id="myModal">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Manual Rates</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
      <div id="modalDataContainer"></div>
      </div>
      
    </div>
  </div>
</div>

<!-- Search Item Modal -->
<div class="modal" id="itemPickModalBiharwrd">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content" style="width: 100%;">
      <div class="modal-header">
        <h4 class="modal-title">SOR</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="modalItemContainer" style="display: flex; gap: 1rem; ">
          <div class="table-responsive" style="width: 25%; overflow: auto; height: calc(100vh - 150px); border: 1px solid #dee2e6; padding: 0.5rem; ">
            <h4>Sub Heads</h4>
            <table class='table table-sm table-bordered table-hover'>
              <thead>
                  <tr>
                      <th>Item No.</th>
                      <th>Description</th>
                  </tr>
              </thead>
              <tbody id="item_seach_header_item">

                <?php
                  $sql = "SELECT * FROM biharwrd2022itemsearch WHERE item_no REGEXP '^[0-9]+\\.[0-9]+$' OR item_no REGEXP '^[0-9]+$' ";
                  $result = mysqli_query($conn, $sql);
                  $numrows = mysqli_num_rows($result);

                  for ($i = 0; $i < $numrows; $i++) {
                    $row = mysqli_fetch_assoc($result);
                    
                    if(preg_match('/^[0-9]+\.[0-9]+$/', $row['item_no'])) {
                ?>
                    <tr onClick="selectedHeadBiharwrd(<?php echo ($row['item_no']); ?>)" class="child_item d-none <?php echo ("child_item_" . (explode( ".", $row['item_no'] )[0])); ?>">
                      <td><?php echo ($row['item_no']); ?></td>
                      <td style="text-align: left; cursor: pointer; text-wrap: nowrap; overflow: hidden;"><?php echo ($row['description']); ?></td>
                    </tr>
                  <?php 
                    } else {
                  ?>
                    <tr onClick="collapseChildBiharwrd(<?php echo ($row['item_no']); ?>)">
                      <td><?php echo ($row['item_no']); ?></td>
                      <td style="text-align: left; font-weight: bolder; cursor: pointer; text-wrap: nowrap; overflow: hidden;"><?php echo ($row['description']); ?></td>
                    </tr>
                <?php
                  } }
                ?>

              </tbody>
            </table>


          </div>
          <div class="table-responsive" style="width: 65%; overflow: auto; height: calc(100vh - 150px);">
            
              <h4 style="text-align: center;">Items</h4>
              <table class='table table-sm table-bordered table-hover' id="sor_table">
                <thead>
                    <tr>
                        <th></th>
                        <th>DSR Item No</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody id="items_tbody">
                </tbody>
              </table>
          </div>
          <div>
          <!-- <div style="display: flex; flex-direction: column; gap: 1rem; overflow: auto; height: calc(100vh - 150px);"> -->
              <!-- <button onClick="addToList()">Add to list</button> -->
              <button onClick="saveList()">Save</button>
              <h6 style="text-align: center;">Selected</h6>
              <table class='table table-sm table-bordered table-hover'>
                <thead>
                    <tr>
                        <th>Item No</th>
                    </tr>
                </thead>
                <tbody id="selected_items_body">
                </tbody>
              </table>
          </div>
        
        </div>
      </div> 
      
    </div>
  </div>
</div>

<div class="modal" id="itemPickModalBiharbcd">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content" style="width: 100%;">
      <div class="modal-header">
        <h4 class="modal-title">SOR</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="modalItemContainer" style="display: flex; gap: 1rem; ">
          <div class="table-responsive" style="width: 25%; overflow: auto; height: calc(100vh - 150px); border: 1px solid #dee2e6; padding: 0.5rem; ">
            <h4>Sub Heads</h4>
            <table class='table table-sm table-bordered table-hover'>
              <thead>
                  <tr>
                      <th>Item No.</th>
                      <th>Description</th>
                  </tr>
              </thead>
              <tbody id="item_seach_header_item">

                <?php
                  $sql = "SELECT * FROM biharbcd2022 WHERE  item_no REGEXP '^[0-9]+$' ";
                  $result = mysqli_query($conn, $sql);
                  $numrows = mysqli_num_rows($result);

                  for ($i = 0; $i < $numrows; $i++) {
                    $row = mysqli_fetch_assoc($result);
                    
                    if(preg_match('/^[0-9]+\.[0-9]+$/', $row['item_no'])) {
                ?>
                    <tr onClick="selectedHeadBiharbcd(<?php echo ($row['item_no']); ?>)" class="child_item d-none <?php echo ("child_item_" . (explode( ".", $row['item_no'] )[0])); ?>">
                      <td><?php echo ($row['item_no']); ?></td>
                      <td style="text-align: left; cursor: pointer; text-wrap: nowrap; overflow: hidden;"><?php echo ($row['description']); ?></td>
                    </tr>
                  <?php 
                    } else {
                  ?>
                    <tr onClick="collapseChildBiharbcd(<?php echo ($row['item_no']); ?>)">
                      <td><?php echo ($row['item_no']); ?></td>
                      <td style="text-align: left; font-weight: bolder; cursor: pointer; text-wrap: nowrap; overflow: hidden;"><?php echo ($row['description']); ?></td>
                    </tr>
                <?php
                  } 
                }
                ?>

              </tbody>
            </table>


          </div>
          <div class="table-responsive" style="width: 65%; overflow: auto; height: calc(100vh - 150px);">
            
              <h4 style="text-align: center;">Items</h4>
              <table class='table table-sm table-bordered table-hover' id="sor_table">
                <thead>
                    <tr>
                        <th></th>
                        <th>DSR Item No</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody id="items_tbody">
                </tbody>
              </table>
          </div>
          <div>
          <!-- <div style="display: flex; flex-direction: column; gap: 1rem; overflow: auto; height: calc(100vh - 150px);"> -->
              <!-- <button onClick="addToList()">Add to list</button> -->
              <button onClick="saveList()">Save</button>
              <h6 style="text-align: center;">Selected</h6>
              <table class='table table-sm table-bordered table-hover'>
                <thead>
                    <tr>
                        <th>Item No</th>
                    </tr>
                </thead>
                <tbody id="selected_items_body">
                </tbody>
              </table>
          </div>
        
        </div>
      </div> 
      
    </div>
  </div>
</div>

<!-- Excel Preview Modal -->
<div class="modal" id="excelPreviewModal">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content" style="width: 100%;">
      <div class="modal-header">
        <h4 class="modal-title">Excel Preview</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="excelPreviewContainer">

          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="tab_analysis" data-bs-toggle="pill" data-bs-target="#pills-analysis" type="button" role="tab" aria-controls="pills-analysis" aria-selected="true">Analysis</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab_abstract" data-bs-toggle="pill" data-bs-target="#pills-abstract" type="button" role="tab" aria-controls="pills-abstract" aria-selected="false">Abstract</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab_labour_strength" data-bs-toggle="pill" data-bs-target="#pills-labour_strength" type="button" role="tab" aria-controls="pills-labour_strength" aria-selected="false">Labour Strength</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="tab_material_statement" data-bs-toggle="pill" data-bs-target="#pills-material_statement" type="button" role="tab" aria-controls="pills-material_statement" aria-selected="false">Material Statement</button>
            </li> <li class="nav-item" role="presentation">
              <button class="btn btn-green" data-bs-toggle="pill" type="button" onclick="submitData()" >Download</button>
            </li>

          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-analysis" role="tabpanel" aria-labelledby="tab_analysis" tabindex="0">...</div>
            <div class="tab-pane fade" id="pills-abstract" role="tabpanel" aria-labelledby="tab_abstract" tabindex="0">...</div>
            <div class="tab-pane fade" id="pills-labour_strength" role="tabpanel" aria-labelledby="tab_labour_strength" tabindex="0">...</div>
            <div class="tab-pane fade" id="pills-material_statement" role="tabpanel" aria-labelledby="tab_material_statement" tabindex="0">...</div>
          </div>

        </div>
      </div> 
    </div>
  </div>
</div>

<!-- Name of Work Modal -->
<div class="modal" id="nowModal">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Name of Work</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="nowForm">
          <div class="form-group">
            <label for="nameofwork" class="mb-1">Name of Work</label>
            <input type="text" class="form-control mb-3" id="nameofwork" aria-describedby="nameofwork" placeholder="Enter name of work">
          </div>
          <button type="button" class="btn btn-primary" onclick="setNameOfWork()">Submit</button>
        </form>
      </div>
      
    </div>
  </div>
</div>
<!-- <div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div id="modalDataContainer"></div>
  </div>
</div> -->
<!-- Modal -->
<div class="modal" id="myModal1">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Manual Rates #1</h4>
        <button type="button" class="close btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
      <div id="modalDataContainer1"></div>
      </div>
      
    </div>
  </div>
</div>
<!-- <div id="myModal1" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div id="modalDataContainer1"></div>
  </div>
</div> -->
<div class="container-fluid">
  <div class="row align-items-center">
    <div class="col p-0" style="background-color:red;">
    </div>
    <div class="col-sm-8 p-0" >
        <div class="container-fluid p-0" style="background-color:white;border-top-left-radius: 10px;  border-top-right-radius:10px;">
      <!-- <div class="pt-2 ps-3 pb-1 mb-3" style="border-top-left-radius: 10px;  border-top-right-radius:10px; background-color:#313866; color:#fff;">
          <span style="font-size:1.5rem;">Rate Analysis</span>
      </div>   -->
        <form>
          <div class="table-container  table-responsive w-100 p-2">
            <table class="table table-sm table-bordered table-hover" id="inputItemTable" >
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>State/Country</th>
                  <th>Department</th>
                  <th>SOR</th>
                  <th>REGION</th>
                  <th>Labour Rate</th>
                  <th>Material Rate</th>
                  <th>Item No.</th>
                  <th>Search</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody id="listBody">
                <tr id="mainList">
                  <td id="srno"></td>
                  <?php
                  $sql = "SELECT * FROM `selector`";
                  $result = mysqli_query($conn, $sql);
                  $numrows = mysqli_num_rows($result);
                  for ($i = 0; $i < $numrows; $i++) {
                    $row = mysqli_fetch_assoc($result);
                    $r = $row['country'];
                    if ($i == 0) {
                      $arrc[$i] = $row['country'];
                    } else {
                      $exist = false;
                      $sql1 = "SELECT * FROM `selector`";
                      $result1 = mysqli_query($conn, $sql1);
                      for ($x = 0; $x < $i; $x++) {
                        $row1 = mysqli_fetch_assoc($result1);
                        $ra = $row1['country'];
                        if ($ra == $r) {
                          $exist = true;
                          break;
                        }
                      }
                      if ($exist == false) {
                        $arrc[$i] = $row['country'];
                      }
                    }
                  }
                  ?>
                  <td>
                    <select class="form-select form-select-sm state" name="state" id="state">
                      <option selected disabled>Country/State</option>
                      <?php
                      foreach ($arrc as $value) { ?>
                        <option value="<?php echo $value; ?>"><?php echo $value; ?></option>
                      <?php
                      } ?>
                    </select>
                  </td>

                  <td>
                    <select  class="form-select form-select-sm department" name="department" id="department">
                      <option selected disabled>Department</option>
                    </select>
                  </td>

                  <td>
                    <select class="form-select form-select-sm sor" name="sor" id="sor">
                      <option selected disabled>SOR</option>
                    </select>
                  </td>

                  <td>
                    <select class="form-select form-select-sm region" name="region" id="region">
                      <option selected disabled>REGION</option>
                    </select>
                  </td>

                  <td>
                    <select class="form-select form-select-sm lrate" name="lrate" id="lrate">
                      <option selected disabled>Labour Rate</option>
                    </select>
                  </td>

                  <td>
                    <select class="form-select form-select-sm mrate" name="mrate" id="mrate">
                      <option selected disabled>Material Rate</option>
                    </select>
                  </td>

                  <script>
                    $(document).ready(function() {
                      $("#listBody").on("change", ".state", function() {
                        var st = $(this).val();
                        var $departmentSelect = $(this).closest('tr').find('select[name="department"]');
                        $.ajax({
                          url: "seldept.php",
                          type: "GET",
                          data: {
                            state: st
                          },
                          success: function(data) {
                            $departmentSelect.html(data);
                          }
                        });
                      });
                    });
                  </script>

                  <script>
                    $(document).ready(function() {
                      $("#listBody").on("change", "#department", function() {
                        var dept = $(this).val();
                        var st = $(this).closest('tr').find('.state').val();
                        var $sorSelect = $(this).closest('tr').find('.sor');
                        console.log(st);

                        $.ajax({
                          url: "selsor.php",
                          type: "GET",
                          data: {
                            state: st,
                            department: dept
                          },
                          success: function(data1) {
                            $sorSelect.html(data1);
                          }
                        });
                      });
                    });
                  </script>

                  <script>
                    $(document).ready(function() {
                      $("#listBody").on("change", "#department", function() {
                        var dept1 = $(this).val();
                        var st1 = $(this).closest('tr').find('.state').val();
                        var $regionSelect = $(this).closest('tr').find('.region');

                        $.ajax({
                          url: "selregion.php",
                          type: "GET",
                          data: {
                            state1: st1,
                            department1: dept1
                          },
                          success: function(data2) {
                            $regionSelect.html(data2);
                          }
                        });
                      });
                    });
                  </script>

                  <script>
                    $(document).ready(function() {
                      $("#listBody").on("change", "#department", function() {
                        var dept1 = $(this).val();
                        var st1 = $(this).closest('tr').find('.state').val();
                        var $lrateSelect = $(this).closest('tr').find('.lrate');

                        $.ajax({
                          url: "sellabourrate.php",
                          type: "GET",
                          data: {
                            state1: st1,
                            department1: dept1
                          },
                          success: function(data2) {
                            $lrateSelect.html(data2);
                          }
                        });
                      });
                    });
                  </script>

                  <script>
                    $(document).ready(function() {
                      $("#listBody").on("change", "#department", function() {
                        var dept1 = $(this).val();
                        var st1 = $(this).closest('tr').find('.state').val();
                        var $mrateSelect = $(this).closest('tr').find('.mrate');

                        $.ajax({
                          url: "selmaterialrate.php",
                          type: "GET",
                          data: {
                            state1: st1,
                            department1: dept1
                          },
                          success: function(data2) {
                            $mrateSelect.html(data2);
                          }
                        });
                      });
                    });
                  </script>

                  <td>
                    <input class="form-control form-control-sm" type="text" placeholder="Item No" style="width: 100px;">
                  </td>
                  <td>
                    <div>
                        <button class="btn btn-sm btn-danger" type="button" onclick="searchItem(this)">
                          <img src="icons/search.png" class="mb-1" style="height:0.85rem;">
                        </button>
                      </div>
                  </td>
                  <td>
                    <div>
                      <button class="btn btn-sm btn-danger" type="button" onclick="delRow(this)">
                        <img src="icons/delete.png" class="mb-1" style="height:0.85rem;">
                      </button>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <div class="p-2" style="border-bottom-left-radius: 10px;  border-bottom-right-radius:10px; background-color:#313866; color:#fff;">
            <div class="row">
              <div class="col-sm-2">
                <button type="button" class="btn btn-sm btn-primary mb-1" data-bs-toggle="modal" data-bs-target="#nowModal">Set Name of Work</button>
              </div>
              <div class="col">
                <button class="btn btn-primary btn-sm" id="add_new_row" type="button" onclick="addRow()">
                  Add 
                  <img src="icons/add.png" class="mb-1" style="height:0.85rem;">
                </button>
                &nbsp;
                 <input type="checkbox" class="form-check-input" name="manualrate" id="manualrate"><span style="display: inline;"> Update Rate </span>
                 <input type="checkbox" class="form-check-input" name="exCpoh" id="exCpoh"><span style="display: inline;"> Exclude CP&OH </span>
                &nbsp;<span style="display: inline;"><i>INCLUDE:</i> </span>
                Abstract <input class="form-check-input mt-2" type="checkbox" name="abstract" id="abstract">
                &nbsp;Labour <input class="form-check-input" type="checkbox" name="labourstrength" id="labourstrength">
                &nbsp;Material <input class="form-check-input" type="checkbox" name="materialstatement" id="materialstatement">
                <input class="btn btn-primary btn-sm" type="button" value="Download" onclick="submitData()" style="float:right; ">
                <input class="btn btn-primary btn-sm" type="button" value="Preview" onclick="excelData()" style="float:right; margin-right: 10px;">
              </div>
            </div>
          </div>
          <!-- <div id="manualpart"></div> -->
        </form>
        </div>
    </div>
    <div class="col p-0" style="background-color:yellow;">
    </div>
  </div>
 
</div>


</form>