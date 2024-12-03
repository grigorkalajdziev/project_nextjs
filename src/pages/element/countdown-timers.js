import Link from "next/link";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { LayoutTwo } from "../../components/Layout";
import {
  CountdownTimerOne,
  CountdownTimerTwo,
  CountdownTimerThree,
  CountdownTimerFour
} from "../../components/Countdown";

const CountdownTimers = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Countdown Timers"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Countdown Timers</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        {/* countdown style one */}
        <CountdownTimerOne
          title="Deal of the day"
          backgroundImage="/assets/images/countdown/bg-countdown-1.jpg"
          dateTime="July 07, 2020 12:12:00"
          url="/shop/left-sidebar"
          buttonText="Only $39"
          spaceBottomClass="space-mb--r100"
        />

        {/* countdown style two */}
        <CountdownTimerTwo
          title="Deal of the day"
          backgroundImage="/assets/images/countdown/bg-countdown-2.jpg"
          dateTime="July 07, 2020 12:12:00"
          url="/shop/left-sidebar"
          buttonText="Only $39"
          spaceBottomClass="space-mb--r100"
        />

        {/* countdown style three */}
        <CountdownTimerThree
          title="Deal of the day"
          image="/assets/images/countdown/countdown-3.jpg"
          dateTime="July 07, 2020 12:12:00"
          url="/shop/left-sidebar"
          buttonText="Only $39"
          spaceBottomClass="space-mb--r100"
        />

        {/* countdown style four */}
        <CountdownTimerFour
          title="Deal of the day"
          image="/assets/images/countdown/countdown-4.png"
          dateTime="July 07, 2020 12:12:00"
          url="/shop/left-sidebar"
          buttonText="Only $39"
          backgroundColorClass="bg-color--grey-two"
        />
      </div>
    </LayoutTwo>
  );
};

export default CountdownTimers;
