<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> iOS联合会员开关</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div>
                <el-switch v-model="status" @change="handleEnable"></el-switch>
            </div>
        </div>

    </div>
</template>

<script>
    import orderService from '../../assets/orderService';

    export default {
        name: 'productList',
        data() {
            return {
                url:{
                  data:'api/switch/',
                },
                status: false
            }
        },
        created() {
          this.getData(true);
        },
        methods: {
            getData() {
                this.$axios.get(orderService+this.url.data + 'status').then((res) => {
                  if(res.data) {
                    this.status = res.data;
                  }
                });
            },
            handleEnable(){
              this.$axios.put(`${orderService}${this.url.data}${this.status}`).then((res) => {
                  this.$message.success("设置成功");
                  this.getData();
              });
            },
        }
    }

</script>

