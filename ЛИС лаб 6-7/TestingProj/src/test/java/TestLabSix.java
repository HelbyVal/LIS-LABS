import com.codeborne.selenide.Condition;
import org.junit.Test;
import static com.codeborne.selenide.Selenide.$x;
import static com.codeborne.selenide.Selenide.open;

public class TestLabSix {

    @Test
    public void GoogleTest() {
        open("https://www.google.ru/?hl=ru");
        $x("//textarea[@type='search']").setValue("Рудин Валентин Константинович").pressEnter();
        $x("//div[@id='result-stats']").shouldBe(Condition.visible);
    }

}
