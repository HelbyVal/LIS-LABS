import com.codeborne.selenide.Condition;
import org.checkerframework.checker.units.qual.C;
import org.junit.Test;

import static com.codeborne.selenide.Selenide.$x;
import static com.codeborne.selenide.Selenide.open;

public class TestLabSeven {

    @Test
    public void basketTest() {
        open("https://etexpress.ru/");
        $x("//input[@id='bx_3966226736_26023_quantity']").setValue("0");
        $x("//span[@data-value='627']").click();
        $x("//a[@data-item='26023']").click();
        $x("//div[@class='basket-item-block-info']").shouldBe(Condition.visible);
    }

    @Test
    public void basketDeleteTest() {
        open("https://etexpress.ru/");
        $x("//input[@id='bx_3966226736_26023_quantity']");
        $x("//span[@data-value='627']").click();
        $x("//a[@data-item='26023']").click();
        $x("//span[@class='delete_all colored_theme_hover_text remove_all_basket']").click();
        $x("//div[@class='bx-sbb-empty-cart-text']").shouldBe(Condition.visible);
    }

    @Test
    public void basketEmptyToCatalogTest() throws Exception {
        open("https://etexpress.ru/basket/");
        $x("//a[@href='/catalog/']").click();
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Каталог");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void basketEmptyToFavoritesTest() throws Exception {
        open("https://etexpress.ru/basket/");
        $x("//a[@href='https://etexpress.ru/favorites/']").click();
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Избранное");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void basketEmptyToBaseTest() throws Exception {
        open("https://etexpress.ru/basket/");
        $x("//a[@href='/']").click();
        boolean b = $x("//h1[@class='mmit-title pxp_h1']").getText().equals("Доставка продуктов на дом интернет-магазин ETexpress.ru");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void addTest() throws Exception {
        open("https://etexpress.ru");
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        boolean b = $x("//input[@id='bx_3966226736_8942_quantity']").getValue().equals("7");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void deleteTest() throws Exception {
        open("https://etexpress.ru");
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_up']").click();
        $x("//span[@id='bx_3966226736_8942_quant_down']").click();
        $x("//span[@id='bx_3966226736_8942_quant_down']").click();
        $x("//span[@id='bx_3966226736_8942_quant_down']").click();
        boolean b = $x("//input[@id='bx_3966226736_8942_quantity']").getValue().equals("1");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void receiptOpenTest() {
        open("https://etexpress.ru");
        $x("//li[@data-code='1082']").click();
        $x("//div[@id='mCSB_13']").shouldBe(Condition.visible);
    }

    @Test
    public void accountEnterTest() {
        open("https://etexpress.ru/auth");
        $x("//input[@id='USER_LOGIN_POPUP']").setValue("Valientin.rudin@mail.ru");
        $x("//input[@id='USER_PASSWORD_POPUP']").setValue("BFn63AA!weK8Rq").pressEnter();
        $x("//a[@class='sale-personal-section-index-block-link box-shadow']").shouldBe(Condition.visible);
    }

    @Test
    public void accountLeaveTest() {
        open("https://etexpress.ru/auth");
        $x("//input[@id='USER_LOGIN_POPUP']").setValue("Valientin.rudin@mail.ru");
        $x("//input[@id='USER_PASSWORD_POPUP']").setValue("BFn63AA!weK8Rq").pressEnter();
        $x("//a[@class='sale-personal-section-index-block-link box-shadow']").shouldBe(Condition.visible);
        $x("//li[contains(@class,'item exit')]//a[@class='icons_fa rounded2 bordered darken']").click();
    }

    @Test
    public void doNotRememberTest() throws Exception {
        open("https://etexpress.ru");
        $x("//div[@id='bx_844512137_67768']//div[@class='title-inner']").click();
        $x("//h1[@id='pagetitle']").shouldBe(Condition.visible);
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Не забудь купить");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void catalogTest() throws Exception {
        open("https://etexpress.ru");
        $x("//td[@class='menu-item dropdown catalog wide_menu']//a[@class='dropdown-toggle']").click();
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Каталог");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void searchTest() throws Exception {
        open("https://etexpress.ru");
        $x("//span[@class='search-icon']//*[name()='svg']").click();
        $x("//input[@id='title-search-input']").setValue("филе").pressEnter();
        $x("//h1[@id='pagetitle']").shouldBe(Condition.visible);
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Поиск");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void openVKTest() {
        open("https://etexpress.ru");
        $x("//div[@class='mmit-footer-icons']//a[@title='Вконтакте'][contains(text(),'Вконтакте')]").click();
    }

    @Test
    public void openTelegrammTest() {
        open("https://etexpress.ru");
        $x("//div[@class='mmit-footer-icons']//a[@title='Telegram'][normalize-space()='Telegram']").click();
    }

    @Test
    public void showAllTest() throws Exception {
        open("https://etexpress.ru");
        $x("//a[@class='font_upper muted']").click();
        $x("//h1[@id='pagetitle']").shouldBe(Condition.visible);
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Интересные товары");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void openWafflesTest() throws Exception {
        open("https://etexpress.ru/lookbooks/");
        $x("//a[@title='Венские вафли']//span[@class='lazy rounded3 set-position center']").click();
        $x("//h1[@id='pagetitle']").shouldBe(Condition.visible);
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Венские вафли");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void backTest() throws Exception {
        open("https://etexpress.ru/lookbooks/");
        $x("//span[@class='breadcrumbs__item-name font_xs'][contains(text(),'Главная')]").click();
        boolean b = $x("//h1[@class='mmit-title pxp_h1']").getText().equals("Доставка продуктов на дом интернет-магазин ETexpress.ru");
        if (!b) {
            throw new Exception();
        }
    }

    @Test
    public void openSchoolTest() throws Exception {
        open("https://etexpress.ru");
        $x("//span[@id='ym_zakazat_zvonok_1']").click();
        $x("//input[contains(@name,'form_text_11')]").shouldBe(Condition.visible);
    }

    @Test
    public void openOceanProductsTest() throws Exception {
        open("https://etexpress.ru");
        $x("//a[contains(@title,'Морепродукты')]//img[contains(@class,'bg-img')]").click();
        $x("//h1[@id='pagetitle']").shouldBe(Condition.visible);
        boolean b = $x("//h1[@id='pagetitle']").getText().equals("Морепродукты. Икра");
        if (!b) {
            throw new Exception();
        }
    }
}