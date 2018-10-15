package com.kodeinc.bcn.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.Repeatable;

/**
 *
 * @author Mover
 */
@Target(value = {ElementType.FIELD})
@Repeatable(ConditionallyMandatories.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionallyMandatory {

    public String parent();

    public String notMandatoryOnValue() default "";

    public String mandatoryOnValue() default "";

}
